from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
from flask import jsonify
from datetime import timedelta
import os

def init_jwt(app):
    # JWT Configuration
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'your-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'your-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']  # Only use cookies
    app.config['JWT_COOKIE_NAME'] = 'access_token_cookie'
    app.config['JWT_COOKIE_HTTPONLY'] = True
    app.config['JWT_COOKIE_SECURE'] = True
    app.config['JWT_COOKIE_SAMESITE'] = 'None'
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['JWT_COOKIE_DOMAIN'] = None
    app.config['JWT_ERROR_MESSAGE_KEY'] = 'message'
    app.config['JWT_COOKIE_PATH'] = '/'
    
    # Initialize JWT
    jwt = JWTManager(app)
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print("Token expired")
        return jsonify({
            'success': False,
            'message': 'The token has expired'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(f"Invalid token: {str(error)}")
        return jsonify({
            'success': False,
            'message': 'Invalid token'
        }), 401
    
    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        print(f"Missing token: {str(error)}")
        return jsonify({
            'success': False,
            'message': 'Missing token'
        }), 401
    
    @jwt.token_verification_failed_loader
    def token_verification_failed_callback(error):
        print(f"Token verification failed: {str(error)}")
        return jsonify({
            'success': False,
            'message': 'Token verification failed'
        }), 401
    
    return jwt
