from flask import Blueprint,jsonify,session
from models.user import User
doctor_bp = Blueprint('doctor', __name__)
@doctor_bp.route('/api/doctor_dashboard', methods=['GET'])
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
