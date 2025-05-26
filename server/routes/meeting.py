from flask import Blueprint, jsonify, request as flask_request
import requests
import os
import time
import json
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.appointment import Appointment

meeting_bp = Blueprint('meeting', __name__)

DAILY_API_KEY = os.getenv("DAILY_API_KEY")
appointment_rooms = {}

@meeting_bp.route('/api/create-room', methods=['POST'])
@jwt_required()
def create_room():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"success": False, "message": "Unauthorized access"}), 401

        # Verify user exists
        user = User.query.get(int(current_user_id))
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 401
        
        data = flask_request.get_json()
        appointment_id = str(data.get("appointment_id"))
        if not appointment_id:
            return jsonify({"success": False, "message": "Appointment ID is required"}), 400

        # Check if room already exists for this appointment
        if appointment_id in appointment_rooms:
            return jsonify({"success": True, "data": {"url": appointment_rooms[appointment_id]}}), 200
        
        # Verify appointment exists and user is authorized
        appointment = Appointment.query.get(int(appointment_id))
        if not appointment:
            return jsonify({"success": False, "message": "Appointment not found"}), 404
            
        # Verify user is either the doctor or patient for this appointment
        if str(appointment.doctor_id) != str(current_user_id) and str(appointment.patient_id) != str(current_user_id):
            return jsonify({"success": False, "message": "Unauthorized access to this appointment"}), 403

        if not DAILY_API_KEY:
            print("Error: DAILY_API_KEY is not set")
            return jsonify({"success": False, "message": "Daily API key not configured"}), 500

        headers = {
            "Authorization": f"Bearer {DAILY_API_KEY}",
            "Content-Type": "application/json"
        }

        room_config = {
            "properties": {
                "exp": int(time.time()) + 3600,
                "enable_transcription": True,
                "enable_live_captions_ui": True,
                "enable_chat": True
            }
        }
        
        print("Creating Daily room with config:", json.dumps(room_config, indent=2))
        
        resp = requests.post(
            "https://api.daily.co/v1/rooms",
            headers=headers,
            json=room_config
        )
        
        print("Daily API status:", resp.status_code)
        print("Daily API response:", resp.text)

        if resp.status_code == 200:
            room_url = resp.json()["url"]
            # Store the room URL for this appointment
            appointment_rooms[appointment_id] = room_url
            return jsonify({"success": True, "data": {"url": room_url}})
        else:
            error_msg = f"Daily API error: {resp.status_code} - {resp.text}"
            print(error_msg)
            return jsonify({"success": False, "message": error_msg}), 500
            
    except Exception as e:
        error_msg = f"Error creating Daily room: {str(e)}"
        print(error_msg)
        return jsonify({"success": False, "message": error_msg}), 500