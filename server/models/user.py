from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from database import db
from dotenv import load_dotenv
load_dotenv()

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
    specialization = db.Column(db.String(100), nullable=True)  # Only for doctors
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # appointments_as_patient = db.relationship('Appointment', foreign_keys='Appointment.patient_id', backref='patient', lazy=True)
    # appointments_as_doctor = db.relationship('Appointment', foreign_keys='Appointment.doctor_id', backref='doctor', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)