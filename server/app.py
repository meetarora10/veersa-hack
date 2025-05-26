import os
import requests
from flask import Flask, render_template, request, redirect, session, url_for, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from dotenv import load_dotenv
from database import db
from models.user import User
from routes.doctor import doctor_bp
from routes.patient import patient_bp
from routes.appointment import appointment_bp
from routes.auth import auth_bp
# from models.doctor_schedule import DoctorSchedule
# from models.schedule import Schedule
from routes.meeting import meeting_bp
from routes.payment import payment_bp
from websocket.chat_server import ChatServer
from routes.file_routes import file_routes
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
from datetime import timedelta
from flask_jwt_extended.exceptions import JWTExtendedException


load_dotenv()
app = Flask(__name__)
app.register_blueprint(patient_bp, url_prefix='/api/patient', name='patient_v2')
app.register_blueprint(payment_bp)
CORS(app, 
     supports_credentials=True, 
     origins=['http://localhost:5173'], 
     allow_headers=['Content-Type', 'Authorization', 'Accept'], 
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     expose_headers=['Set-Cookie'],
     allow_credentials=True)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.getenv('SECRET_KEY')
DAILY_API_KEY = os.environ.get('DAILY_API_KEY')
db.init_app(app)

# Session and JWT Configuration
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'your-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'your-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_NAME'] = 'access_token_cookie'
app.config['JWT_COOKIE_HTTPONLY'] = True
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'
app.config['JWT_COOKIE_SECURE'] = False  # Set to False for development
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Set to False for development
app.config['JWT_COOKIE_DOMAIN'] = None  # Allow cookies to work on localhost
app.config['JWT_ERROR_MESSAGE_KEY'] = 'message'
app.config['JWT_COOKIE_PATH'] = '/'  # Ensure cookie is available for all paths
app.config['JWT_JSON_KEY'] = 'access_token'  # Key to use in JSON responses
app.config['JWT_HEADER_NAME'] = 'Authorization'  # Header name for JWT
app.config['JWT_HEADER_TYPE'] = 'Bearer'  # Token type in header

# Initialize JWT
jwt = JWTManager(app)

# JWT error handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print("Token expired")
    return jsonify({
        'success': False,
        'message': 'The token has expired'
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print(f"Invalid token: {str(error)}")
    return jsonify({
        'success': False,
        'message': 'Invalid token'
    }), 401

@jwt.unauthorized_loader
def unauthorized_callback(error):
    print(f"Missing token: {str(error)}")
    return jsonify({
        'success': False,
        'message': 'Missing token'
    }), 401

@jwt.token_verification_failed_loader
def token_verification_failed_callback(error):
    print(f"Token verification failed: {str(error)}")
    return jsonify({
        'success': False,
        'message': 'Token verification failed'
    }), 401

socketio = SocketIO(app, cors_allowed_origins=["http://localhost:5173"])

def init_db():
    with app.app_context():
        db.create_all()
        print("Database initialized!")
init_db()
chat_server = ChatServer(app)

app.register_blueprint(file_routes, url_prefix='/api/files')
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(doctor_bp)
app.register_blueprint(appointment_bp, url_prefix='/api')
app.register_blueprint(meeting_bp)

@app.route('/api/transcription/start/<room_name>', methods=['POST'])
def start_transcription(room_name):
    try:
        daily_api_key = os.getenv('DAILY_API_KEY')
        if not daily_api_key:
            return jsonify({'error': 'DAILY_API_KEY not configured'}), 500

        response = requests.post(
            f'https://api.daily.co/v1/rooms/{room_name}/transcription/start',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {daily_api_key}'
            },
            json={
                'language': 'en',
                'model': 'nova-2',
                'punctuate': True,
                'profanity_filter': True
            }
        )
        print(response)
        print('Daily API status:', response.status_code)
        print('Daily API response:', response.text)

        if not response.ok:
            return jsonify({'error': f'Daily API responded with status: {response.status_code}'}), response.status_code

        return jsonify(response.json())
    
    except Exception as e:
        print('Transcription start error:', str(e))
        return jsonify({'error': str(e)}), 500    

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    chat_server.run(app, host='0.0.0.0', port=port, debug=True)

