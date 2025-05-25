import json
import uuid
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import datetime

class ChatServer:
    def __init__(self, app):
        self.socketio = SocketIO(app, cors_allowed_origins="*")
        self.setup_handlers()

    def setup_handlers(self):
        @self.socketio.on('connect')
        def handle_connect():
            print('Client connected')

        @self.socketio.on('disconnect')
        def handle_disconnect():
            print('Client disconnected')

        @self.socketio.on('join')
        def handle_join(data):
            room_id = data.get('roomId')
            if room_id:
                join_room(room_id)
                emit('status', {'msg': 'Joined room: ' + room_id}, room=room_id)

        @self.socketio.on('message')
        def handle_message(data):
            room_id = data.get('roomId')
            content = data.get('content')
            
            if room_id and content:
                message = {
                    'type': 'message',
                    'id': str(uuid.uuid4()),
                    'content': content,
                    'timestamp': datetime.utcnow().isoformat(),
                    'roomId': room_id
                }
                emit('message', message, room=room_id)

        @self.socketio.on('file')
        def handle_file(data):
            room_id = data.get('roomId')
            file_name = data.get('fileName')
            file_url = data.get('fileUrl')
            
            if room_id and file_name and file_url:
                file_message = {
                    'type': 'file',
                    'id': str(uuid.uuid4()),
                    'fileName': file_name,
                    'fileUrl': file_url,
                    'timestamp': datetime.utcnow().isoformat(),
                    'roomId': room_id
                }
                emit('file', file_message, room=room_id)

    def run(self, app, **kwargs):
        self.socketio.run(app, **kwargs) 