from database import db
class DoctorSchedule(db.Model):
    __tablename__ = 'doctor_schedules'

    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    day = db.Column(db.String(20), nullable=False)  
    time_slot = db.Column(db.String(10), nullable=False) 
    def __repr__(self):
        return f"<DoctorSchedule doctor_id={self.doctor_id}, day={self.day}, time_slot={self.time_slot}>"