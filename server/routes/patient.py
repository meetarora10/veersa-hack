from flask import Blueprint,jsonify,session
from models.user import User
patient_bp = Blueprint('patient', __name__)
@patient_bp.route('/api/patient_dashboard', methods=['GET'])
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