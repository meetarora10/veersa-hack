import os
from flask import Flask, render_template, request, redirect, session, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.getenv('SECRET_KEY')

db = SQLAlchemy(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tele.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'patient', 'doctor', 'admin'

    # Recommended additions:
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    specialization = db.Column(db.String(100))  # Only for doctors
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships (optional, but clean for SQLAlchemy)
    appointments_as_patient = db.relationship('Appointment', foreign_keys='Appointment.patient_id', backref='patient', lazy=True)
    appointments_as_doctor = db.relationship('Appointment', foreign_keys='Appointment.doctor_id', backref='doctor', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
# ------------------ Database Initialization ------------------ #
def init_db():
    with app.app_context():
        db.create_all()
        print("Database initialized!")
# Initialize database during app setup
init_db()
if __name__ == '__main__':
    app.run(debug=True)