from flask import Blueprint, jsonify, request
from models.user import User
from models.appointment import Appointment
from models.schedule import Schedule
from datetime import datetime
from database import db
from flask_jwt_extended import jwt_required, get_jwt_identity

doctor_bp = Blueprint('doctor', __name__)

@doctor_bp.route('/api/doctor_dashboard', methods=['GET'])
@jwt_required()
def doctor_dashboard():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 401

        # Fetch doctor-specific data
        doctor = User.query.get(int(current_user_id))
        if not doctor or doctor.role != 'doctor':
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 403

        # Fetch appointments for this doctor
        appointments_data = []
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
            'price': doctor.price,
            'appointments': appointments_data,
        }
        return jsonify({'success': True, 'data': data}), 200
    except Exception as e:
        print(f"Error in doctor dashboard: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@doctor_bp.route('/api/available_slots', methods=['GET'])
@jwt_required()
def get_available_slots():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 401

        doctor_id = request.args.get('doctor_id')
        date = request.args.get('date')

        try:
            doctor_id = int(doctor_id) if doctor_id else None
        except ValueError:
            return jsonify({'success': False, 'message': 'Invalid doctor ID format'}), 400

        if not doctor_id or not date:
            return jsonify({'success': False, 'message': 'Doctor ID and date are required'}), 400

        # Verify the doctor exists
        doctor = User.query.get(doctor_id)
        if not doctor or doctor.role != 'doctor':
            return jsonify({'success': False, 'message': 'Doctor not found'}), 404

        # Verify the requesting user is either the doctor or a patient
        user = User.query.get(int(current_user_id))
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 401
        if user.role not in ['doctor', 'patient']:
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 403

        day = datetime.strptime(date, '%Y-%m-%d').strftime('%A')
        availability = Schedule.query.filter_by(doctor_id=doctor_id, day=day).all()
        booked_appointments = Appointment.query.filter_by(doctor_id=doctor_id, date=date).all()
        # extract time from both availabilty and booked appointments
        available_slots = [str(slot.time_slot) for slot in availability]
        booked_slots = [str(appt.time) for appt in booked_appointments]
        # remove booked slots from available slots
        free_slots = [slot for slot in available_slots if slot not in booked_slots]

        return jsonify({'success': True, 'available_slots': free_slots}), 200
    except Exception as e:
        print(f"Error fetching available slots: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@doctor_bp.route('/api/doctor_profile', methods=['PUT'])
@jwt_required()
def update_doctor_profile():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 401

        # Get the updated data from request
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400

        # Find the doctor
        doctor = User.query.filter_by(id=int(current_user_id), role='doctor').first()
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
            # Handle empty string or null values for price
            if data['price'] == "" or data['price'] is None:
                doctor.price = None
            else:
                try:
                    doctor.price = float(data['price'])
                except (ValueError, TypeError):
                    return jsonify({'success': False, 'message': 'Invalid price format'}), 400
        if 'image' in data:
            doctor.image = data['image']

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
@jwt_required()
def get_doctors():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'success': False, 'message': 'Unauthorized access'}), 401

        specialization = request.args.get('specialization')
        doctor_id = request.args.get('id')
        date = request.args.get('date')  # Optional date parameter
        query = User.query.filter_by(role='doctor')

        if doctor_id:
            doctor = query.filter_by(id=doctor_id).first()
            if not doctor:
                return jsonify({'error': 'Doctor not found'}), 404

            # Get doctor's schedule
            schedule = Schedule.query.filter_by(doctor_id=doctor.id).all()
            availability = {}
            for slot in schedule:
                if slot.day not in availability:
                    availability[slot.day] = []
                availability[slot.day].append(slot.time_slot)

            # If date is provided, get booked slots for that date
            booked_slots = []
            if date:
                day = datetime.strptime(date, '%Y-%m-%d').strftime('%A')
                booked_appointments = Appointment.query.filter_by(
                    doctor_id=doctor.id,
                    date=date
                ).all()
                booked_slots = [appt.time for appt in booked_appointments]

            return jsonify({
                'id': doctor.id,
                'name': doctor.name,
                'specialization': doctor.specialization,
                'experience': getattr(doctor, 'experience', ''),
                'location': getattr(doctor, 'location', ''),
                'photoUrl': getattr(doctor, 'photoUrl', ''),
                'price': getattr(doctor, 'price', None),
                'availability': availability,
                'booked_slots': booked_slots if date else None
            }), 200

        if specialization:
            doctors = query.filter(
                User.specialization.ilike(f"%{specialization}%")
            ).all()
        else:
            doctors = query.all()

        doctors_data = []
        for doctor in doctors:
            # Get doctor's schedule
            schedule = Schedule.query.filter_by(doctor_id=doctor.id).all()
            availability = {}
            for slot in schedule:
                if slot.day not in availability:
                    availability[slot.day] = []
                availability[slot.day].append(slot.time_slot)

            doctors_data.append({
                'id': doctor.id,
                'name': doctor.name,
                'specialization': doctor.specialization,
                'experience': getattr(doctor, 'experience', ''),
                'location': getattr(doctor, 'location', ''),
                'photoUrl': getattr(doctor, 'photoUrl', ''),
                'price': getattr(doctor, 'price', None),
                'availability': availability
            })

        return jsonify(doctors_data), 200
    except Exception as e:
        print(f"Error fetching doctors: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500