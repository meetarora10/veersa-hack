import doctors from '../utils/doctors.json';
import { FaCalendarAlt, FaUserMd, FaInfoCircle } from 'react-icons/fa';

function Doctors() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-10">Our Doctors</h1>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 text-center relative overflow-hidden"
            >
              {/* Glowing ring with default classes */}
              <div className="relative w-28 h-28 mx-auto mb-4">
                {/* Outer animated glow ring */}
                <div className="absolute inset-0 rounded-full bg-blue-200 blur-md opacity-60 animate-pulse z-0"></div>
                {/* Doctor image */}
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-md z-10"
                />
              </div>

              {/* Info */}
              <h2 className="text-xl font-semibold text-blue-800 mt-2">{doc.name}</h2>
              <p className="text-gray-600">{doc.specialty}</p>
              <p className="text-gray-500 text-sm">{doc.experience}</p>
              <p className="text-gray-500 text-sm">{doc.location}</p>

              {/* Action Icons */}
              <div className="flex justify-center gap-5 mt-6">
                <div className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 cursor-pointer shadow transition" title="Book Appointment">
                  <FaCalendarAlt />
                </div>
                <div className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 cursor-pointer shadow transition" title="Hospital Profile">
                  <FaUserMd />
                </div>
                <div className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 cursor-pointer shadow transition" title="About Doctor">
                  <FaInfoCircle />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Doctors;
