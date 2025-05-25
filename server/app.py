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


load_dotenv()
app = Flask(__name__)
app.register_blueprint(patient_bp, url_prefix='/api/patient', name='patient_v2')
app.register_blueprint(payment_bp)
CORS(app, supports_credentials=True, origins=['http://localhost:5173'], allow_headers=['Content-Type'], methods=['GET', 'POST', 'OPTIONS'])
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.getenv('SECRET_KEY')
DAILY_API_KEY = os.environ.get('DAILY_API_KEY')
db.init_app(app)


def init_db():
    with app.app_context():
        db.create_all()
        print("Database initialized!")
init_db()
chat_server = ChatServer(app)

app.register_blueprint(file_routes, url_prefix='/api/files')
app.register_blueprint(auth_bp, url_prefix='/api/')
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
    chat_server.run(app, host='0.0.0.0', port=port)

