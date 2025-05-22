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
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 text-center relative overflow-hidden"
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

              <div className="absolute left-0 bottom-0 w-full h-30 pointer-events-none">
                <div className="absolute left-0 bottom-[-32px] w-full h-20 flex justify-center items-end z-20
                  transition-all duration-500 ease-in-out
                  translate-y-full group-hover:translate-y-0
                  pointer-events-auto
                ">
                  <div className="w-full h-full bg-gradient-to-t from-blue-600/90 to-blue-400/60 rounded-t-[60px] flex justify-center items-end gap-6 pb-8 shadow-lg">
                    <div className="relative group/icon">
                      <span className="absolute inset-0 rounded-full bg-blue-300 blur-md opacity-70 animate-pulse z-0"></span>
                      <div className="relative bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 cursor-pointer z-10 border-4 border-white transition">
                        <FaCalendarAlt size={12} />
                      </div>
                    </div>
                    <div className="relative group/icon">
                      <span className="absolute inset-0 rounded-full bg-green-300 blur-md opacity-70 animate-pulse z-0"></span>
                      <div className="relative bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 cursor-pointer z-10 border-4 border-white transition">
                        <FaUserMd size={12} />
                      </div>
                    </div>
                    <div className="relative group/icon">
                      <span className="absolute inset-0 rounded-full bg-gray-400 blur-md opacity-70 animate-pulse z-0"></span>
                      <div className="relative bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 cursor-pointer z-10 border-4 border-white transition">
                        <FaInfoCircle size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 z-10 pointer-events-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Doctors;