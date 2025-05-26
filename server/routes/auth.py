# routes/auth.py

from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash
from models.user import User
from models.schedule import Schedule
from database import db
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, set_access_cookies
import os
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

        if not email or not password or not confirm_password or not name or not age or not gender:
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        if email.count('@') != 1 or '.' not in email.split('@')[1]:
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        if role == 'doctor' and int(age)<20:
            return jsonify({'success': False, 'message': 'Doctor must be at least 20 years old'}), 400
        if role == 'doctor' and not specialization:
            return jsonify({'success': False, 'message': 'Specialization is required for doctors'}), 400
        if len(password) < 8:
            return jsonify({'success': False, 'message': 'Password must be at least 8 characters long'}), 400
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
                Schedule(doctor_id=new_user.id, day='Monday', time_slot='16:00'),
                Schedule(doctor_id=new_user.id, day='Tuesday', time_slot='10:00'),
                Schedule(doctor_id=new_user.id, day='Tuesday', time_slot='11:00'),
                Schedule(doctor_id=new_user.id, day='Tuesday', time_slot='16:00'),
                Schedule(doctor_id=new_user.id, day='Wednesday', time_slot='10:00'),
                Schedule(doctor_id=new_user.id, day='Wednesday', time_slot='11:00'),
                Schedule(doctor_id=new_user.id, day='Wednesday', time_slot='16:00'),
                Schedule(doctor_id=new_user.id, day='Thursday', time_slot='10:00'),
                Schedule(doctor_id=new_user.id, day='Thursday', time_slot='11:00'),
                Schedule(doctor_id=new_user.id, day='Thursday', time_slot='16:00'),
                Schedule(doctor_id=new_user.id, day='Friday', time_slot='10:00'),
                Schedule(doctor_id=new_user.id, day='Friday', time_slot='11:00'),
                Schedule(doctor_id=new_user.id, day='Friday', time_slot='16:00'),
                Schedule(doctor_id=new_user.id, day='Saturday', time_slot='10:00'),
                Schedule(doctor_id=new_user.id, day='Saturday', time_slot='11:00'),
                Schedule(doctor_id=new_user.id, day='Saturday', time_slot='16:00'),
                Schedule(doctor_id=new_user.id, day='Sunday', time_slot='10:00'),
                Schedule(doctor_id=new_user.id, day='Sunday', time_slot='11:00'),
                Schedule(doctor_id=new_user.id, day='Sunday', time_slot='16:00'),
            ]
            db.session.add_all(slots)
            db.session.commit()

        return jsonify({'success': True, 'message': 'Registration successful'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500


# @auth_bp.route('/login', methods=['POST'])
# def login():
#     try:
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')

#         if not email or not password:
#             return jsonify({'success': False, 'message': 'Email and password are required'}), 400

#         user = User.query.filter_by(email=email).first()
#         if user and user.check_password(password):
#             access_token = create_access_token(identity=str(user.id))
#             response = jsonify({
#                 'success': True, 
#                 'message': 'Login successful', 
#                 'id': user.id, 
#                 'role': user.role
#             })
            
#             # Set the JWT cookie
#             response.set_cookie(
#                 'access_token_cookie',
#                 access_token,
#                 httponly=True,
#                 secure=False,  # Set to False for development
#                 samesite='Lax',
#                 max_age=86400,  # 1 day
#                 path='/',
#                 domain=None  # Allow cookie to work on localhost
#             )
            
#             print(f"Login successful for user {user.id}. Token set in cookie.")
#             return response
#         else:
#             print(f"Login failed for email {email}")
#             return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

#     except Exception as e:
#         print(f"Login error: {str(e)}")
#         return jsonify({'success': False, 'message': f'Login failed: {str(e)}'}), 500
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
            access_token = create_access_token(identity=str(user.id))
            response = jsonify({
                'success': True, 
                'message': 'Login successful', 
                'id': user.id, 
                'role': user.role
            })
            
            # Check environment for cookie settings
            env = os.getenv('FLASK_ENV', 'production').lower()
            is_dev = env == 'development'
            
            # Set the JWT cookie with proper settings
            response.set_cookie(
                'access_token_cookie',
                access_token,
                httponly=True,
                secure=True,  # Must be True for SameSite=None
                samesite='None' if is_dev else 'Lax',  # Use None for cross-site in dev
                max_age=86400,  # 1 day
                path='/',
                domain=None  # Allow cookie to work on localhost
            )
            
            print(f"Login successful for user {user.id}. Token set in cookie.")
            return response
        else:
            print(f"Login failed for email {email}")
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'success': False, 'message': f'Login failed: {str(e)}'}), 500
@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = jsonify({'success': True, 'message': 'Logged out successfully'})
    response.delete_cookie('access_token_cookie', path='/', domain=None)
    return response

@auth_bp.route('/verify-session', methods=['GET'])
@jwt_required()
def verify_session():
    try:
        current_user_id = get_jwt_identity()
        print(f"Verifying session for user ID: {current_user_id}, type: {type(current_user_id)}")
        
        if not current_user_id:
            print("No user ID found in token")
            return jsonify({'success': False, 'message': 'Invalid token'}), 401
            
        try:
            # Convert string ID back to integer for database query
            user_id = int(current_user_id)
            user = User.query.get(user_id)
            
            if not user:
                print(f"User not found for ID: {user_id}")
                return jsonify({'success': False, 'message': 'User not found'}), 401
                
            print(f"Session verified for user: {user.name}")
            return jsonify({
                'success': True,
                'id': user.id,
                'role': user.role,
                'name': user.name
            })
        except ValueError as e:
            print(f"Invalid user ID format: {current_user_id}")
            return jsonify({'success': False, 'message': 'Invalid user ID format'}), 401
            
    except Exception as e:
        print(f"Session verification error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 401
