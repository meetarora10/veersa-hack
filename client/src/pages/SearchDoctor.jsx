import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function SearchDoctor() {
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!specialty) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/doctors?specialization=${specialty}`);
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Search for a Doctor</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}>
        <label>
          Enter Specialization:
          <input type="text" name="specialization" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
        </label>
        <button type="submit">Search</button>
      </form>
      {loading && <p className='text-center'>Loading Doctors...</p>}
      {doctors.length > 0 && (
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">{doctor.name}</h3>
              <p className="text-gray-600">Specialization: {doctor.specialization}</p>
              <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => {
                navigate(`/book-appointment/${doctor.id}`);
              }}>
                Book Appointment
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchDoctor
