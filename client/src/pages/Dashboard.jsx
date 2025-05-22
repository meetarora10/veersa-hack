import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsOverview from "../components/StatsOverview";
import UpcomingAppointments from "../components/UpcomingAppointments";
import RecentActivity from "../components/RecentActivity";
import { FaHome, FaCalendar, FaEnvelope, FaUser } from "react-icons/fa";

const TelehealthDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [userRole] = useState("Doctor");

  const sidebarItems = [
    { id: "home", icon: <FaHome />, label: "Home" },
    { id: "appointments", icon: <FaCalendar />, label: "Appointments" },
    { id: "messages", icon: <FaEnvelope />, label: "Messages" },
    { id: "profile", icon: <FaUser />, label: "Profile" }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patientName: "John Doe",
      dateTime: "2024-02-20 10:00 AM",
      specialty: "Cardiology",
      type: "Video Call",
      status: "upcoming"
    },
    {
      id: 2,
      patientName: "Jane Smith",
      dateTime: "2024-02-20 11:30 AM",
      specialty: "General",
      type: "Audio Call",
      status: "pending"
    }
  ];

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
        <Topbar userRole={userRole} />
        <div className="p-6 overflow-auto h-[calc(100vh-4rem)]">
          <StatsOverview />
          <UpcomingAppointments appointments={upcomingAppointments} />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default TelehealthDashboard;