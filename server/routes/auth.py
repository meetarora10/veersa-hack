# routes/auth.py

from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash
from models.user import User
from models.schedule import Schedule
from database import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        age = data.get('age')
        gender = data.get('gender')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        role = data.get('role', 'patient')
        specialization = data.get('specialization')

        if not email or not password or not confirm_password:
            return jsonify({'success': False, 'message': 'All fields are required'}), 400

        if password != confirm_password:
            return jsonify({'success': False, 'message': 'Passwords do not match'}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'success': False, 'message': 'Email already exists'}), 409

        hashed_password = generate_password_hash(password)
        new_user = User(name=name, age=age, gender=gender, email=email,
                        password_hash=hashed_password, role=role, specialization=specialization)

        db.session.add(new_user)
        db.session.commit()

        if role == 'doctor':
            slots = [
                Schedule(doctor_id=new_user.id, day='Monday', time_slot='10:00'),
                Schedule(doctor_id=new_user.id, day='Monday', time_slot='11:00'),
                Schedule(doctor_id=new_user.id, day='Tuesday', time_slot='10:00'),
                Schedule(doctor_id=new_user.id, day='Tuesday', time_slot='11:00'),
            ]
            db.session.add_all(slots)
            db.session.commit()

        return jsonify({'success': True, 'message': 'Registration successful'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500


@auth_bp.route('/login', methods=['POST'])
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
            session.permanent = True
            return jsonify({'success': True, 'message': 'Login successful', 'id': user.id, 'role': user.role}), 200
        else:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

    except Exception as e:
        return jsonify({'success': False, 'message': f'Login failed: {str(e)}'}), 500
