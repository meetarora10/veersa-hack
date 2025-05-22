import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsOverview from "../components/StatsOverview";
import UpcomingAppointments from "../components/UpcomingAppointments";
import RecentActivity from "../components/RecentActivity";
import DoctorProfile from "../components/DoctorProfile";
import { FaHome, FaCalendar, FaEnvelope, FaUser } from "react-icons/fa";

const DoctorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch('http://localhost:5000/api/doctor_dashboard', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setUserData(data.data);
      }
    };
    fetchDashboard();
  }, []);

  const sidebarItems = [
    { id: "home", icon: <FaHome />, label: "Home" },
    { id: "appointments", icon: <FaCalendar />, label: "Appointments" },
    { id: "messages", icon: <FaEnvelope />, label: "Messages" },
    { id: "profile", icon: <FaUser />, label: "Profile" }
  ];

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background dark:bg-dark-background">
      <Sidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarItems={sidebarItems}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1 overflow-hidden">
        <Topbar userRole="Doctor" />
        <div className="p-6 overflow-auto h-[calc(100vh-4rem)]">
          <StatsOverview />
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Doctor Dashboard</h2>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Age:</strong> {userData.age}</p>
              <p><strong>Gender:</strong> {userData.gender}</p>
              <p><strong>Specialization:</strong> {userData.specialization}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Patients</h3>
              {userData.patients && userData.patients.length > 0 ? (
                <ul>
                  {userData.patients.map((patient) => (
                    <li key={patient.id} className="border-b py-2">
                      {patient.name} - {patient.age} years old
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No patients assigned.</p>
              )}
            </div>
          </div>
          <UpcomingAppointments appointments={userData.appointments || []} />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;