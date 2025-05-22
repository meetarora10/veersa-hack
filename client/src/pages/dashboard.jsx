import React, { useState } from "react";
import { FiHome, FiCalendar, FiFileText, FiUser, FiLogOut, FiBell, FiSettings, FiMenu, FiDownload, FiMessageSquare } from "react-icons/fi";
import { format } from "date-fns";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2"
  },
  {
    id: 2,
    name: "Dr. James Cooper",
    specialty: "Neurology",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
  }
];

const appointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    date: "2024-02-15",
    time: "10:00 AM",
    status: "Confirmed",
    prescription: "prescription1.pdf",
    transcript: "visit_notes.pdf",
    rating: 5,
    feedback: "Excellent consultation"
  },
  {
    id: 2,
    doctor: "Dr. James Cooper",
    specialty: "Neurology",
    date: "2024-02-18",
    time: "2:30 PM",
    status: "Pending",
    prescription: null,
    transcript: null,
    rating: null,
    feedback: null
  }
];

const userProfile = {
  name: "Alex Johnson",
  age: 32,
  gender: "Male",
  email: "alex@example.com",
  phone: "+1 234 567 8900",
  medicalConditions: ["Hypertension", "Asthma"],
  emergencyContact: {
    name: "Sarah Johnson",
    relation: "Spouse",
    phone: "+1 234 567 8901"
  }
};

const TelehealthDashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [consultationReason, setConsultationReason] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [activeChat, setActiveChat] = useState(null);

  const specialties = ["Cardiology", "Neurology", "Pediatrics", "Dermatology"];

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Hi {userProfile.name} 👋</h2>
              <div className="text-sm text-gray-600">{format(new Date(), "EEEE, MMMM d")}</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Next Appointment</h3>
              {appointments[0] && (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{appointments[0].doctor}</p>
                    <p className="text-gray-600">{appointments[0].specialty}</p>
                    <p className="text-gray-600">{appointments[0].date} at {appointments[0].time}</p>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Join Call
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold">Upcoming</h4>
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-gray-600">Appointments</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold">Pending</h4>
                <p className="text-2xl font-bold">
                  {appointments.filter(a => a.status === "Pending").length}
                </p>
                <p className="text-gray-600">Reviews</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold">Messages</h4>
                <p className="text-2xl font-bold">3</p>
                <p className="text-gray-600">Unread</p>
              </div>
            </div>
          </div>
        );

      case "appointments":
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Upcoming Appointments</h2>
              <div className="grid grid-cols-1 gap-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{appointment.doctor}</h3>
                      <p className="text-gray-600">{appointment.specialty}</p>
                      <p className="text-gray-600">{appointment.date} at {appointment.time}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${appointment.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {appointment.status}
                      </span>
                      {appointment.status === "Confirmed" && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                          Join Call
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-800">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Consultation History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left">Doctor</th>
                      <th className="p-4 text-left">Date</th>
                      <th className="p-4 text-left">Documents</th>
                      <th className="p-4 text-left">Rating</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(appointment => (
                      <tr key={appointment.id} className="border-t">
                        <td className="p-4">{appointment.doctor}</td>
                        <td className="p-4">{appointment.date}</td>
                        <td className="p-4">
                          {appointment.prescription && (
                            <button className="text-blue-600 hover:text-blue-800 mr-2">
                              <FiDownload /> Prescription
                            </button>
                          )}
                        </td>
                        <td className="p-4">
                          {appointment.rating ? 
                            <span className="text-yellow-500">{'★'.repeat(appointment.rating)}</span> :
                            <button className="text-blue-600 hover:text-blue-800">Rate</button>
                          }
                        </td>
                        <td className="p-4">
                          <button className="text-blue-600 hover:text-blue-800">
                            <FiMessageSquare /> Chat
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold">Profile & Health Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                      type="text" 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      value={userProfile.name}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input 
                      type="number" 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      value={userProfile.age}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medical Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.medicalConditions.map(condition => (
                    <span key={condition} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {condition}
                    </span>
                  ))}
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  + Add Condition
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                      type="text" 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      value={userProfile.emergencyContact.name}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input 
                      type="text" 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      value={userProfile.emergencyContact.phone}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiMenu size={24} />
          </button>
        </div>
        <nav className="mt-8">
          {[
            { icon: FiHome, label: "Home", id: "home" },
            { icon: FiCalendar, label: "Book Consultation", id: "book" },
            { icon: FiFileText, label: "Appointments", id: "appointments" },
            { icon: FiUser, label: "Profile", id: "profile" },
            { icon: FiLogOut, label: "Logout", id: "logout" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center p-4 hover:bg-gray-100 ${activeSection === item.id ? "bg-blue-50 text-blue-600" : ""}`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="ml-4">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                alt="User avatar"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-medium">{userProfile.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <FiBell size={20} />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiSettings size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default TelehealthDashboard;