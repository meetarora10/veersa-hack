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
              className="relative group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 text-center overflow-hidden"
            >
              {/* Glowing Image Circle */}
              <div className="relative w-28 h-28 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-200 via-blue-100 to-transparent animate-ping-slow z-0"></div>
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="relative w-full h-full object-cover rounded-full border-4 border-white z-10 shadow-md"
                />
              </div>

              {/* Doctor Info */}
              <h2 className="text-xl font-semibold text-blue-800 mt-2">{doc.name}</h2>
              <p className="text-gray-600">{doc.specialty}</p>
              <p className="text-gray-500 text-sm">{doc.experience}</p>
              <p className="text-gray-500 text-sm mb-4">{doc.location}</p>

              {/* Action Icons (visible always now, styled cleanly) */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition cursor-pointer shadow-md" title="Book Appointment">
                  <FaCalendarAlt className="text-lg" />
                </div>
                <div className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition cursor-pointer shadow-md" title="Hospital Profile">
                  <FaUserMd className="text-lg" />
                </div>
                <div className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 transition cursor-pointer shadow-md" title="About Doctor">
                  <FaInfoCircle className="text-lg" />
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
