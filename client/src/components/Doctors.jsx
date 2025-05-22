import Navbar from '../components/Navbar';

const doctors = [
  {
    id: 1,
    name: 'Dr. Arjun Mehta',
    specialty: 'Cardiologist',
    experience: '12 years',
    location: 'Delhi, India',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    specialty: 'Dermatologist',
    experience: '8 years',
    location: 'Mumbai, India',
    image: 'https://randomuser.me/api/portraits/women/50.jpg',
  },
  {
    id: 3,
    name: 'Dr. Rakesh Verma',
    specialty: 'Neurologist',
    experience: '15 years',
    location: 'Bangalore, India',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
];

function Doctors() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-10">Our Doctors</h1>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center"
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-blue-200 object-cover"
              />
              <h2 className="text-xl font-semibold text-blue-800">{doc.name}</h2>
              <p className="text-gray-600">{doc.specialty}</p>
              <p className="text-gray-500 text-sm">{doc.experience}</p>
              <p className="text-gray-500 text-sm mb-4">{doc.location}</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Doctors;
