from flask import Blueprint, jsonify, request
from models.user import User
from models.patient import update_patient_profile
from models.appointment import Appointment
from flask_jwt_extended import jwt_required, get_jwt_identity
from pprint import pprint
import json
import os
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy

patient_bp = Blueprint('patient', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads', 'profile_images')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

db = SQLAlchemy()

@patient_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def patient_dashboard():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 401

        # Fetch patient-specific data
        patient = User.query.get(int(current_user_id))
        if not patient or patient.role != 'patient':
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 403

        # Fetch appointments for this patient
        appointments = Appointment.query.filter_by(patient_id=patient.id).all()
        appointments_data = []
        for a in appointments:
            doctor = User.query.get(a.doctor_id)
            appointments_data.append({
                'id': a.id,
                'doctor': doctor.name if doctor else "",
                'specialty': a.specialty,
                'date': a.date,
                'time': a.time,
                'status': a.status,
                'prescription': getattr(a, 'prescription', None),
                'rating': getattr(a, 'rating', None)
            })

        data = {
            'name': patient.name,
            'age': patient.age,
            'gender': patient.gender,
            'email': patient.email,
            'phone': getattr(patient, 'phone', ''),
            'medicalConditions': getattr(patient, 'medical_conditions', '').split(',') if getattr(patient, 'medical_conditions', '') else [],
            'emergencyContact': {
                'name': getattr(patient, 'emergency_contact_name', ''),
                'phone': getattr(patient, 'emergency_contact_phone', ''),
                'relation': getattr(patient, 'emergency_contact_relation', ''),
            },
            'appointments': appointments_data,
            'image': getattr(patient, 'image', None)
        }

        return jsonify({'success': True, 'data': data}), 200
    except Exception as e:
        print(f"Error in patient dashboard: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@patient_bp.route('/update_profile_form', methods=['POST'])
@jwt_required()
def update_profile_form():
    from pprint import pprint
    import json

    print("---- FORM DATA ----")
    pprint(request.form)
    print("---- FILES ----")
    pprint(request.files)

    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 401

        user = User.query.get(int(current_user_id))
        if not user or user.role != 'patient':
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 403

        profile_data = {
            "name": request.form.get("name"),
            "age": request.form.get("age"),
            "gender": request.form.get("gender"),
            "email": request.form.get("email"),
            "phone": request.form.get("phone"),
            "medicalConditions": json.loads(request.form.get("medicalConditions", "[]")),
            "emergencyContact": json.loads(request.form.get("emergencyContact", "{}")),
        }
        image = request.files.get("image")

        if not profile_data:
            return jsonify({'success': False, 'message': 'Missing profile data'}), 400

        print(f"Parsed profile data for user {current_user_id}:")
        pprint(profile_data)
        if image:
            print(f"Received image file: {image.filename}")
            filename = secure_filename(image.filename)
            unique_filename = f"{user.id}_{filename}"
            image_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            image.save(image_path)
            image_url = f"/uploads/profile_images/{unique_filename}"
            user.image = image_url

        # Dummy: pretend to save the profile and image
        success = update_patient_profile(int(current_user_id), profile_data)
        # You can add your image saving logic here

        db.session.commit()

        if success:
            return jsonify({'success': True, 'message': 'Profile updated (form version)'})
        else:
            return jsonify({'success': False, 'message': 'Update failed'}), 500
    except Exception as e:
        print(f"Error updating profile (form): {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500