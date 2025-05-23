import sqlite3

def update_patient_profile(user_id, profile):
    try:
        conn = sqlite3.connect('instance/tele.db')
        cur = conn.cursor()
        cur.execute("""
            UPDATE patients SET
                name = ?,
                age = ?,
                gender = ?,
                email = ?,
                phone = ?,
                medical_conditions = ?,
                emergency_contact_name = ?,
                emergency_contact_phone = ?,
                emergency_contact_relation = ?
            WHERE id = ?
        """, (
            profile.get('name'),
            profile.get('age'),
            profile.get('gender'),
            profile.get('email'),
            profile.get('phone'),
            ','.join(profile.get('medicalConditions', [])),
            profile.get('emergencyContact', {}).get('name'),
            profile.get('emergencyContact', {}).get('phone'),
            profile.get('emergencyContact', {}).get('relation'),
            user_id
        ))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print("Error updating patient profile:", e)
        return False