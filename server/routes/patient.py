from flask import Blueprint, jsonify, request
from models.user import User
from models.patient import update_patient_profile
from models.appointment import Appointment
from flask_jwt_extended import jwt_required, get_jwt_identity

patient_bp = Blueprint('patient', __name__)

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
            'appointments': appointments_data
        }

        return jsonify({'success': True, 'data': data}), 200
    except Exception as e:
        print(f"Error in patient dashboard: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@patient_bp.route('/update_profile', methods=['POST'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 401

        data = request.json
        profile_data = data.get('profile')
        if not profile_data:
            return jsonify({'success': False, 'message': 'Missing profile data'}), 400

        # Verify user is a patient
        user = User.query.get(int(current_user_id))
        if not user or user.role != 'patient':
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 403

        success = update_patient_profile(int(current_user_id), profile_data)
        if success:
            return jsonify({'success': True, 'message': 'Profile updated'})
        else:
            return jsonify({'success': False, 'message': 'Update failed'}), 500
    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500