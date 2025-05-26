from database import db
from models.user import User

def update_patient_profile(user_id, profile):
    try:
        user = User.query.get(int(user_id))
        if not user:
            return False

        # Update basic profile information
        user.name = profile.get('name')
        user.age = int(profile.get('age')) if profile.get('age') else None
        user.gender = profile.get('gender')
        user.email = profile.get('email')
        
        # Update additional fields
        user.phone = profile.get('phone')
        user.medical_conditions = ','.join(profile.get('medicalConditions', []))
        user.emergency_contact_name = profile.get('emergencyContact', {}).get('name')
        user.emergency_contact_phone = profile.get('emergencyContact', {}).get('phone')
        user.emergency_contact_relation = profile.get('emergencyContact', {}).get('relation')

        db.session.commit()
        return True
    except Exception as e:
        print("Error updating patient profile:", e)
        db.session.rollback()
        return False