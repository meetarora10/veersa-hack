from flask import Blueprint,jsonify,session,request
from models.user import User
from models.appointment import Appointment
# from models.doctor_schedule import DoctorSchedule
from models.schedule import Schedule
from datetime import datetime
from database import db
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
@doctor_bp.route('/api/available_slots', methods=['GET'])
def get_available_slots():
    # if 'user_id' not in session or session['role'] != 'doctor':
    #     return jsonify({'success': False, 'message': 'Unauthorized access'}), 403
    doctor_id = request.args.get('doctor_id')
    date = request.args.get('date')
    try:
        doctor_id = int(doctor_id) if doctor_id else None
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid doctor ID format'}), 400
    if not doctor_id or not date:
        return jsonify({'success': False, 'message': 'Doctor ID and date are required'}), 400
    print("doctor_id",doctor_id)
    print("date",date)
    # Fetch the doctor's schedule for the given date
    try:
        day = datetime.strptime(date, '%Y-%m-%d').strftime('%A')
        # to get all the available sots for that day
        availability = Schedule.query.filter_by(doctor_id=doctor_id, day=day).all()
        # to get the booked appointment
        booked_appointments = Appointment.query.filter_by(doctor_id=doctor_id, date=date).all()
        # extract time from both availabilty and booked appointments
        available_slots = [slot.time_slot for slot in availability]
        booked_slots = [appt.time for appt in booked_appointments]
        # remove booked slots from available slots
        free_slots = [slot for slot in available_slots if slot not in booked_slots]
        print("Available slots from DB:", [slot.time_slot for slot in availability])
        print("Booked slots from DB:", [appt.time for appt in booked_appointments])
        return jsonify({'success': True, 'available_slots': free_slots}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error fetching available slots: {str(e)}'}), 500
@doctor_bp.route('/api/doctor_profile', methods=['PUT'])
def update_doctor_profile():
    try:
        # Get doctor ID from session
        doctor_id = session.get('doctor_id') or session.get('user_id')
        
        if not doctor_id:
            return jsonify({'success': False, 'message': 'Unauthorized'}), 401
        
        # Get the updated data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        # Find the doctor
        doctor = User.query.filter_by(id=doctor_id, role='doctor').first()
        
        if not doctor:
            return jsonify({'success': False, 'message': 'Doctor not found'}), 404
        
        # Update fields if provided
        if 'name' in data:
            doctor.name = data['name']
        if 'age' in data:
            doctor.age = int(data['age']) if data['age'] else None
        if 'gender' in data:
            doctor.gender = data['gender']
        if 'specialization' in data:
            doctor.specialization = data['specialization']
        if 'price' in data:
            doctor.price = float(data['price']) if data['price'] else None
        if 'image' in data:
            doctor.image = data['image']
        
        # Commit changes to database
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'data': doctor.to_dict()
        })
        
    except ValueError as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Invalid data type: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Error updating doctor profile: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
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