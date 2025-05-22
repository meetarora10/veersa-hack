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
              className="relative group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all p-6 text-center overflow-hidden"
            >
              {/* Animated Image Circle */}
              <div className="relative w-28 h-28 mx-auto mb-4 rounded-full border-4 border-blue-200 group-hover:border-blue-600 transition-all duration-500">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-inner"
                />
                <div className="absolute inset-0 rounded-full animate-pulse bg-blue-100 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>

              {/* Doctor Info */}
              <h2 className="text-xl font-semibold text-blue-800">{doc.name}</h2>
              <p className="text-gray-600">{doc.specialty}</p>
              <p className="text-gray-500 text-sm">{doc.experience}</p>
              <p className="text-gray-500 text-sm">{doc.location}</p>

              {/* Hidden Buttons */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 cursor-pointer shadow-md">
                  <FaCalendarAlt className="text-lg" title="Book Appointment" />
                </div>
                <div className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 cursor-pointer shadow-md">
                  <FaUserMd className="text-lg" title="Hospital Profile" />
                </div>
                <div className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 cursor-pointer shadow-md">
                  <FaInfoCircle className="text-lg" title="About Doctor" />
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
