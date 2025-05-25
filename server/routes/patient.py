from flask import Blueprint,jsonify,session, request
from models.user import User
from models.patient import update_patient_profile
from models.appointment import Appointment
import json
patient_bp = Blueprint('patient', __name__)

@patient_bp.route('/dashboard', methods=['GET'])
def patient_dashboard():
    if 'user_id' not in session or session['role'] != 'patient':
        return jsonify({'success': False, 'message': 'Unauthorized access'}), 403

    # Fetch patient-specific data
    patient = User.query.get(session['user_id'])
    if not patient:
        return jsonify({'success': False, 'message': 'Patient not found'}), 404

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

@patient_bp.route('/update_profile', methods=['POST'])
def update_profile():
    from pprint import pprint
    import json

    print("---- FORM DATA ----")
    pprint(request.form)
    print("---- FILES ----")
    pprint(request.files)

    try:
        user_id = request.form.get('user_id')
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

        if not user_id or not profile_data:
            return jsonify({'success': False, 'message': 'Missing data'}), 400

        # Optional: print to confirm parsed data
        print(f"Parsed profile data for user {user_id}:")
        pprint(profile_data)

        # Dummy: pretend to save the profile
        success = True  # Replace with actual DB call

        if success:
            return jsonify({'success': True, 'message': 'Profile updated'})
        else:
            return jsonify({'success': False, 'message': 'Update failed'}), 500
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'success': False, 'message': str(e)}), 500

