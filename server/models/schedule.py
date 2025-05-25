from database import db
class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    day = db.Column(db.String(20), nullable=False)  
    time_slot = db.Column(db.String(10), nullable=False) 