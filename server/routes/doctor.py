from flask import Blueprint,jsonify,session,request
from models.user import User
from models.appointment import Appointment
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
    # Fetch appointments for this doctor
    appointments_data=[]
    appointments = Appointment.query.filter_by(doctor_id=doctor.id).all()
    for appt in appointments:
        patient = User.query.get(appt.patient_id)
        appointments_data.append({
            'id': appt.id,
            'patient': patient.name if patient else "",
            'date': appt.date,
            'time': appt.time,
            'status': appt.status,
        })
    data = {
        'name': doctor.name,
        'age': doctor.age,
        'gender': doctor.gender,
        'specialization': doctor.specialization,
        'appointments': appointments_data,
    }
    return jsonify({'success': True, 'data': data}), 200

@doctor_bp.route('/api/doctors', methods=['GET'])
def get_doctors():
    specialization = request.args.get('specialization')
    doctor_id = request.args.get('id')
    query = User.query.filter_by(role='doctor')

    if doctor_id:
        doctor = query.filter_by(id=doctor_id).first()
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404
        return jsonify({
            'id': doctor.id,
            'name': doctor.name,
            'specialization': doctor.specialization,
            'experience': getattr(doctor, 'experience', ''),
            'location': getattr(doctor, 'location', ''),
            'photoUrl': getattr(doctor, 'photoUrl', ''),
            'price': getattr(doctor, 'price', None)
        }), 200

    if specialization:
        doctors = query.filter(
            User.specialization.ilike(f"%{specialization}%")
        ).all()
    else:
        doctors = query.all()
    return jsonify([{
        'id': doctor.id,
        'name': doctor.name,
        'specialization': doctor.specialization,
        'experience': getattr(doctor, 'experience', ''),
        'location': getattr(doctor, 'location', ''),
        'photoUrl': getattr(doctor, 'photoUrl', ''),
        'price': getattr(doctor, 'price', None)
    } for doctor in doctors]), 200