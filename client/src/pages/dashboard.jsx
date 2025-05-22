import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PatientHome from "../components/PatientHome
import PatientAppointments from "../components/PatientAppointments";
import PatientProfile from "../components/PatientProfile";
import { FiHome, FiCalendar, FiFileText, FiUser, FiLogOut } from "react-icons/fi";


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

const sidebarItems = [
  { id: "home", icon: <FiHome />, label: "Home" },
  { id: "book", icon: <FiCalendar />, label: "Book Consultation" },
  { id: "appointments", icon: <FiFileText />, label: "Appointments" },
  { id: "profile", icon: <FiUser />, label: "Profile" },
  { id: "logout", icon: <FiLogOut />, label: "Logout" }
];

const TelehealthDashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  let content = null;
  if (activeSection === "home") {
    content = <PatientHome userProfile={userProfile} appointments={appointments} />;
  } else if (activeSection === "appointments") {
    content = <PatientAppointments appointments={appointments} />;
  } else if (activeSection === "profile") {
    content = <PatientProfile userProfile={userProfile} />;
  } else {
    content = null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        activeTab={activeSection}
        setActiveTab={setActiveSection}
        sidebarItems={sidebarItems}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1 overflow-auto">
        <Topbar userRole={userProfile.name} />
        <main className="p-6">
          {content}
        </main>
      </div>
    </div>
  );
};

export default TelehealthDashboard;