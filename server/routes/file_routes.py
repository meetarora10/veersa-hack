import os
import uuid
from flask import Blueprint, request, send_file, jsonify, current_app
from werkzeug.utils import secure_filename
from datetime import datetime
import fs
from fs.osfs import OSFS
import io

file_routes = Blueprint('file_routes', __name__)

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'}
MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB limit

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize filesystem after ensuring directory exists
fs_instance = OSFS(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@file_routes.route('/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if not file:
            return jsonify({'error': 'Invalid file'}), 400
            
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
            
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}-{filename}"
        
        # Save file using fs
        with fs_instance.open(unique_filename, 'wb') as f:
            file.save(f)
        
        # Get file info using fs with details namespace
        file_info = fs_instance.getinfo(unique_filename, namespaces=['details'])
        
        file_data = {
            'id': str(uuid.uuid4()),
            'fileName': filename,  # Original filename
            'uniqueFileName': unique_filename,  # Store the unique filename
            'filePath': os.path.join(UPLOAD_FOLDER, unique_filename),
            'fileUrl': f'/api/files/download/{unique_filename}',
            'uploadDate': datetime.utcnow().isoformat(),
            'size': file_info.size,
            'mimeType': file.content_type
        }
        
        return jsonify(file_data)
        
    except Exception as e:
        current_app.logger.error(f"File upload error: {str(e)}")
        return jsonify({'error': 'File upload failed', 'details': str(e)}), 500

@file_routes.route('/download/<filename>', methods=['GET', 'OPTIONS'])
def download_file(filename):
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        if not fs_instance.exists(filename):
            return jsonify({'error': 'File not found'}), 404
        
        # Read file using fs
        with fs_instance.open(filename, 'rb') as f:
            file_data = f.read()
        
        # Get original filename
        original_filename = filename.split('-', 1)[1] if '-' in filename else filename
        
        # Get file extension
        file_ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
        
        # Determine if this is a preview request
        is_preview = request.args.get('preview', 'false').lower() == 'true'
        
        # Set appropriate mimetype based on file extension
        mimetype = 'application/octet-stream'
        if file_ext in ['jpg', 'jpeg']:
            mimetype = 'image/jpeg'
        elif file_ext == 'png':
            mimetype = 'image/png'
        elif file_ext == 'gif':
            mimetype = 'image/gif'
        elif file_ext == 'pdf':
            mimetype = 'application/pdf'
        elif file_ext == 'txt':
            mimetype = 'text/plain'
        elif file_ext in ['doc', 'docx']:
            mimetype = 'application/msword'
        
        response = send_file(
            io.BytesIO(file_data),
            as_attachment=not is_preview,
            download_name=original_filename,
            mimetype=mimetype
        )
        
        # Add headers to prevent caching
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        
        return response
        
    except Exception as e:
        current_app.logger.error(f"File download error: {str(e)}")
        return jsonify({'error': 'File download failed', 'details': str(e)}), 500 