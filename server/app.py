import os
from flask import Flask, render_template, request, redirect, session, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=['http://localhost:5173'])
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.getenv('SECRET_KEY')

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'patient', 'doctor', 'admin'

    # Recommended additions:
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    specialization = db.Column(db.String(100), nullable=True)  # Only for doctors
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships (optional, but clean for SQLAlchemy)
    # appointments_as_patient = db.relationship('Appointment', foreign_keys='Appointment.patient_id', backref='patient', lazy=True)
    # appointments_as_doctor = db.relationship('Appointment', foreign_keys='Appointment.doctor_id', backref='doctor', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
# ------------------ Database Initialization ------------------ #
def init_db():
    with app.app_context():
        db.create_all()
        print("Database initialized!")
# Initialize database during app setup
init_db()

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name= data.get('name')
        age = data.get('age')
        gender = data.get('gender')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        role = data.get('role', 'patient')  # Default to 'patient' if not provided
        specialization = data.get('specialization')
        # Validate required fields
        if not email or not password or not confirm_password:
            return jsonify({'success': False, 'message': 'All fields are required'}), 400

        if password != confirm_password:
            return jsonify({'success': False, 'message': 'Passwords do not match'}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'success': False, 'message': 'Email already exists'}), 409

        # Hash password and create user
        hashed_password = generate_password_hash(password)
        new_user = User(name=name, age=age, gender=gender, email=email, password_hash=hashed_password, role=role, specialization=specialization)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Registration successful'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            session['role'] = user.role
            session.permanent = True  # Make the session permanent
            print("after login",dict(session))
            return jsonify({'success': True, 'message': 'Login successful', 'role': user.role}), 200
        else:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

    except Exception as e:
        return jsonify({'success': False, 'message': f'Login failed: {str(e)}'}), 500
    

@app.route('/api/doctor_dashboard', methods=['GET'])
def doctor_dashboard():
    if 'user_id' not in session or session['role'] != 'doctor':
        return jsonify({'success': False, 'message': 'Unauthorized access'}), 403

    # Fetch doctor-specific data
    doctor = User.query.get(session['user_id'])
    if not doctor:
        return jsonify({'success': False, 'message': 'Doctor not found'}), 404

    # Example data to return
    data = {
        'name': doctor.name,
        'age': doctor.age,
        'gender': doctor.gender,
        'specialization': doctor.specialization,
        'patients': [] 
    }

    return jsonify({'success': True, 'data': data}), 200
@app.route('/api/patient_dashboard', methods=['GET'])
def patient_dashboard():
    if 'user_id' not in session or session['role'] != 'patient':
        return jsonify({'success': False, 'message': 'Unauthorized access'}), 403

    # Fetch patient-specific data
    patient = User.query.get(session['user_id'])
    if not patient:
        return jsonify({'success': False, 'message': 'Patient not found'}), 404

    # Example data to return
    data = {
        'name': patient.name,
        'age': patient.age,
        'gender': patient.gender
    }

    return jsonify({'success': True, 'data': data}), 200

if __name__ == '__main__':
    app.run(debug=True)