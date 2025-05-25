from flask import Blueprint, jsonify, request as flask_request
import requests
import os
import time
import json

meeting_bp = Blueprint('meeting', __name__)

DAILY_API_KEY = os.getenv("DAILY_API_KEY")

@meeting_bp.route('/api/create-room', methods=['GET'])
def create_room():
    if not DAILY_API_KEY:
        print("Error: DAILY_API_KEY is not set")
        return jsonify({"error": "Daily API key not configured"}), 500

    headers = {
        "Authorization": f"Bearer {DAILY_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
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
            return jsonify({"url": resp.json()["url"]})
        else:
            error_msg = f"Daily API error: {resp.status_code} - {resp.text}"
            print(error_msg)
            return jsonify({"error": error_msg}), 500
            
    except Exception as e:
        error_msg = f"Error creating Daily room: {str(e)}"
        print(error_msg)
        return jsonify({"error": error_msg}), 500