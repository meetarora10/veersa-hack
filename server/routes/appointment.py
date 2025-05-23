from flask import Blueprint, request, jsonify
from models.appointment import Appointment
from models.user import User
from database import db

appointment_bp = Blueprint("appointment", __name__)

@appointment_bp.route("/appointments", methods=["POST"])
def book_appointment():
    data = request.json
    patient_id = data.get("patient_id")
    doctor_id = data.get("doctor_id")
    specialty = data.get("specialty")
    date = data.get("date")
    time = data.get("time")

    if not all([patient_id, doctor_id, specialty, date, time]):
        return jsonify({"error": "Missing fields"}), 400

    appointment = Appointment(
        patient_id=patient_id,
        doctor_id=doctor_id,
        specialty=specialty,
        date=date,
        time=time,
    )

    db.session.add(appointment)
    db.session.commit()

    return jsonify({"message": "Appointment booked successfully!"}), 201
