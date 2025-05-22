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
      {/* Show profile section only when Profile tab is active */}
      {activeTab === "profile" ? (
        <div className="flex-1 flex items-center justify-center pt-8">
          <DoctorProfile userData={userData} />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <Topbar userRole="Doctor" />
          <div className="p-6 overflow-auto h-[calc(100vh-4rem)]">
            <StatsOverview />
            
            <UpcomingAppointments appointments={userData.appointments || []} />
            <RecentActivity />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;