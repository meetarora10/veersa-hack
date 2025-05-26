from flask import Blueprint, request, jsonify
from models.appointment import Appointment
from models.user import User
from database import db
from flask_jwt_extended import jwt_required, get_jwt_identity

appointment_bp = Blueprint("appointment", __name__)

@appointment_bp.route("/appointments", methods=["POST"])
@jwt_required()
def book_appointment():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"success": False, "message": "Unauthorized access"}), 401

        data = request.json
        doctor_id = data.get("doctor_id")
        specialty = data.get("specialty")
        date = data.get("date")
        time = data.get("time")

        if not all([doctor_id, specialty, date, time]):
            return jsonify({"success": False, "message": "Missing fields"}), 400

        # Verify the requesting user is a patient
        patient = User.query.get(int(current_user_id))
        if not patient or patient.role != 'patient':
            return jsonify({"success": False, "message": "Only patients can book appointments"}), 403

        # Verify the doctor exists
        doctor = User.query.get(int(doctor_id))
        if not doctor or doctor.role != 'doctor':
            return jsonify({"success": False, "message": "Invalid doctor"}), 400

        appointment = Appointment(
            patient_id=int(current_user_id),
            doctor_id=int(doctor_id),
            specialty=specialty,
            date=date,
            time=time,
            status="pending"
        )

        db.session.add(appointment)
        db.session.commit()

        return jsonify({"success": True, "message": "Appointment booked successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error booking appointment: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

