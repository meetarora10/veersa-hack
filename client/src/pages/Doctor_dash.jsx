import React from 'react'
import { useState,useEffect } from 'react'
function Doctor_dash() {
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      const res = await fetch('http://localhost:5000/api/doctor_dashboard', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setDoctorData(data.data);
      } else {
        console.error(data.message);
      }
    };

    fetchDoctorData();
  }, []);

  if (!doctorData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Doctor Dashboard</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        <p><strong>Name:</strong> {doctorData.name}</p>
        <p><strong>Age:</strong> {doctorData.age}</p>
        <p><strong>Gender:</strong> {doctorData.gender}</p>
        <p><strong>Specialization:</strong> {doctorData.specialization}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold mb-4">Patients</h3>
        {doctorData.patients.length > 0 ? (
          <ul>
            {doctorData.patients.map((patient) => (
              <li key={patient.id} className="border-b py-2">
                {patient.name} - {patient.age} years old
              </li>
            ))}
          </ul>
        ) : (
          <p>No patients assigned.</p>
        )}
      </div>
    </div>
  )
}

export default Doctor_dash
