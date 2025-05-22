import doctors from '../utils/doctors.json';
import { FaEnvelope, FaPhoneAlt, FaHospital } from 'react-icons/fa';

function Doctors() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-10">Our Doctors</h1>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              {/* Doctor Image */}
              <img
                src={doc.image}
                alt={doc.name}
                className="w-full h-72 object-cover"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-indigo-600 text-white flex justify-center gap-6 py-3 rounded-t-[50%] translate-y-full group-hover:translate-y-0 transition-all duration-500">
                <div className="cursor-pointer hover:scale-110 transition">
                  <FaEnvelope className="text-xl" title="Message" />
                </div>
                <div className="cursor-pointer hover:scale-110 transition">
                  <FaPhoneAlt className="text-xl" title="Call" />
                </div>
                <div className="cursor-pointer hover:scale-110 transition">
                  <FaHospital className="text-xl" title="Hospital Info" />
                </div>
              </div>

              {/* Name & Specialty */}
              <div className="text-center py-4">
                <h2 className="text-lg font-semibold text-gray-800">{doc.name}</h2>
                <p className="text-indigo-600 text-sm">{doc.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Doctors;
