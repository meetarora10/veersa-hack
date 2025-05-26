import os
import requests
from flask import Blueprint, jsonify

transcription_bp = Blueprint('transcription_bp', __name__)

@transcription_bp.route('/transcription/start/<room_name>', methods=['POST'])
def start_transcription(room_name):
    try:
        daily_api_key = os.getenv('DAILY_API_KEY')
        if not daily_api_key:
            return jsonify({'error': 'DAILY_API_KEY not configured'}), 500

        response = requests.post(
            f'https://api.daily.co/v1/rooms/{room_name}/transcription/start',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {daily_api_key}'
            },
            json={
                'language': 'en',
                'model': 'nova-2',
                'punctuate': True,
                'profanity_filter': True
            }
        )
        print(response)
        print('Daily API status:', response.status_code)
        print('Daily API response:', response.text)

        if not response.ok:
            return jsonify({'error': f'Daily API responded with status: {response.status_code}'}), response.status_code

        return jsonify(response.json())
    
    except Exception as e:
        print('Transcription start error:', str(e))
        return jsonify({'error': str(e)}), 500 