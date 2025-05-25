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
from models.schedule import Schedule
from routes.meeting import meeting_bp
from routes.payment import payment_bp


load_dotenv()
app = Flask(__name__)
app.register_blueprint(patient_bp, url_prefix='/api/patient', name='patient_v2')
app.register_blueprint(payment_bp)
CORS(app, supports_credentials=True, origins=['http://localhost:5173'])
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.getenv('SECRET_KEY')
DAILY_API_KEY = os.environ.get('DAILY_API_KEY')
db.init_app(app)
# ------------------ Database Initialization ------------------ #
def init_db():
    with app.app_context():
        db.create_all()
        print("Database initialized!")
# Initialize database during app setup
init_db()
# @app.route('/api/register', methods=['POST'])
# def register():
#     try:
#         data = request.get_json()
#         name= data.get('name')
#         age = data.get('age')
#         gender = data.get('gender')
#         email = data.get('email')
#         password = data.get('password')
#         confirm_password = data.get('confirm_password')
#         role = data.get('role', 'patient')  # Default to 'patient' if not provided
#         specialization = data.get('specialization')
#         # Validate required fields
#         if not email or not password or not confirm_password:
#             return jsonify({'success': False, 'message': 'All fields are required'}), 400

#         if password != confirm_password:
#             return jsonify({'success': False, 'message': 'Passwords do not match'}), 400

#         existing_user = User.query.filter_by(email=email).first()
#         if existing_user:
#             return jsonify({'success': False, 'message': 'Email already exists'}), 409

#         # Hash password and create user
#         hashed_password = generate_password_hash(password)
#         new_user = User(name=name, age=age, gender=gender, email=email, password_hash=hashed_password, role=role, specialization=specialization)

#         db.session.add(new_user)
#         db.session.commit()
#         print("role",role)
#         if role == 'doctor':
#             slots = [ 
#             Schedule(doctor_id=new_user.id, day='Monday', time_slot='10:00'),
#             Schedule(doctor_id=new_user.id, day='Monday', time_slot='11:00'),
#             Schedule(doctor_id=new_user.id, day='Tuesday', time_slot='10:00'),
#             Schedule(doctor_id=new_user.id, day='Tuesday', time_slot='11:00'),
#             ]
#             db.session.add_all(slots)
#             db.session.commit()
        
#         # db.session.query(DoctorSchedule).delete()
#         # print('emtied')
#         # db.session.execute('DELETE FROM doctor_schedules')
#         # db.session.commit()
#         # print('Table emptied')
#         return jsonify({'success': True, 'message': 'Registration successful'}), 201

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500
    
# @app.route('/api/login', methods=['POST'])
# def login():
#     try:
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')
        
#         if not email or not password:
#             return jsonify({'success': False, 'message': 'Email and password are required'}), 400

#         user = User.query.filter_by(email=email).first()
#         if user and user.check_password(password):
#             session['user_id'] = user.id
#             session['role'] = user.role
#             session.permanent = True  # Make the session permanent
#             print("after login",dict(session))
#             return jsonify({'success': True, 'message': 'Login successful','id': user.id, 'role': user.role}), 200
#         else:
#             return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

#     except Exception as e:
#         return jsonify({'success': False, 'message': f'Login failed: {str(e)}'}), 500
    
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
    app.run(debug=True, host='127.0.0.1', port=5000)