import { useEffect,useState } from 'react'

function Patient_dash() {
    const [patientData, setPatientData] = useState(null);
    useEffect(() => {
        const fetchPatientData = async () => {
            const res = await fetch('http://localhost:5000/api/patient_dashboard', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                setPatientData(data.data);
            } else {
                console.error(data.message);
            }
        };

        fetchPatientData();
    }, []);
    if (!patientData) {
        return <div>Loading...</div>;
    }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Patient Dashboard</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <p><strong>Name:</strong> {patientData.name}</p>
            <p><strong>Age:</strong> {patientData.age}</p>
            <p><strong>Gender:</strong> {patientData.gender}</p>
            
        </div>
    </div>
  )
}

export default Patient_dash;