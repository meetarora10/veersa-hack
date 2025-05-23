import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../utils/Debounce";

function SearchDoctor() {
  const [specialty, setSpecialty] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const debouncedSpecialty = useDebounce(specialty, 500);

  // Clear doctors instantly when input is cleared
  useEffect(() => {
    if (!specialty) {
      setDoctors([]);
      setLoading(false);
    }
  }, [specialty]);

  // Fetch doctors after debounced value changes
  useEffect(() => {
    if (!debouncedSpecialty.trim()) return;
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/doctors?specialization=${debouncedSpecialty}`
        );
        if (!response.ok) throw new Error("Error fetching doctors");
        const data = await response.json();
        setDoctors(data || []);
      } catch (error) {
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [debouncedSpecialty]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <label className="flex-1 w-full">
          <span className="block text-blue-700 font-semibold mb-1">
            Enter Specialization:
          </span>
          <input
            type="text"
            name="specialization"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="e.g. Cardiologist"
            autoComplete="off"
          />
        </label>
      </div>

      {loading && (
        <p className="text-center text-blue-600 font-medium">
          Loading doctors...
        </p>
      )}

      {!loading && doctors.length > 0 && (
        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100 mt-4 pr-2">
          <ul className="space-y-4">
            {doctors.map((doctor) => (
              <li
                key={doctor.id}
                className="p-5 bg-blue-100 rounded-xl shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">
                    {doctor.name}
                  </h3>
                  <p className="text-blue-700">
                    Specialization:{" "}
                    <span className="font-medium">{doctor.specialization}</span>
                  </p>
                  <p className="text-blue-700">
                    Price:{" "}
                    <span className="font-medium">
                      ₹{doctor.price ? doctor.price.toFixed(2) : "N/A"}
                    </span>
                  </p>
                </div>
                <button
                  className="mt-3 sm:mt-0 bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                  onClick={() => {
                    navigate(`/book-appointment/${doctor.id}`);
                  }}
                >
                  Book Appointment
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && doctors.length === 0 && debouncedSpecialty && (
        <p className="text-center text-gray-500 mt-8">
          No doctors found. Try searching for another specialization.
        </p>
      )}
    </div>
  );
}

export default SearchDoctor;
