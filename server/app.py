import os
import requests
from flask import Flask, render_template, request, redirect, session, url_for, flash, jsonify, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from dotenv import load_dotenv
from database import db
from models.user import User
from routes.doctor import doctor_bp
from routes.patient import patient_bp
from routes.appointment import appointment_bp
from routes.auth import auth_bp
from routes.meeting import meeting_bp
from routes.payment import payment_bp
from websocket.chat_server import ChatServer
from routes.file_routes import file_routes
from routes.transcription_routes import transcription_bp
from flask_socketio import SocketIO
from jwt_config import init_jwt
from flask_jwt_extended import jwt_required, get_jwt_identity


load_dotenv()
app = Flask(__name__)
app.register_blueprint(patient_bp, url_prefix='/api/patient', name='patient_v2')
app.register_blueprint(payment_bp)
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://veersa-hack-c4cr.vercel.app",
                "https://veersa-hack-c4cr-wa6c7ty2i-meet-aroras-projects.vercel.app"
            ],
            "supports_credentials": True,
            "allow_headers": ["Content-Type", "Authorization", "Accept"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "expose_headers": ["Set-Cookie"]
        },
        r"/uploads/*": {
            "origins": [
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://veersa-hack-c4cr.vercel.app",
                "https://veersa-hack-c4cr-wa6c7ty2i-meet-aroras-projects.vercel.app"
            ],
            "supports_credentials": True,
            "allow_headers": ["Content-Type", "Authorization", "Accept"],
            "methods": ["GET", "OPTIONS"],
            "expose_headers": ["Set-Cookie"]
        }
    },
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "Accept"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    expose_headers=["Set-Cookie"]
)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.getenv('SECRET_KEY')
DAILY_API_KEY = os.environ.get('DAILY_API_KEY')
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
db.init_app(app)

# Initialize JWT
jwt = init_jwt(app)

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
app.register_blueprint(transcription_bp, url_prefix='/api')

@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        print(f"Error serving file: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    chat_server.run(app, host='0.0.0.0', port=port, debug=True)

