import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DoctorHome from "../components/DoctorHome";
import DoctorAppointments from "../components/DoctorAppointments";
import DoctorProfile from "../components/DoctorProfile";
import { FaHome, FaCalendar, FaEnvelope, FaUser} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const DoctorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/doctor_dashboard', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setUserData(data.data);
          setAppointments(data.data.appointments || []);
        } else {
          console.error("Failed to fetch doctor dashboard:", data.message);
        }
      } catch (err) {
        console.error("Error fetching doctor dashboard:", err);
      }
    };
    fetchDashboard();
  }, []);

  const sidebarItems = [
    { id: "home", icon: <FaHome />, label: "Home" },
    { id: "appointments", icon: <FaCalendar />, label: "Appointments" },
    { id: "messages", icon: <FaEnvelope />, label: "Messages" },
    { id: "profile", icon: <FaUser />, label: "Profile" },
    { id: "logout", icon: <FiLogOut />, label: "Logout" },
  ];

  const renderContent = () => {
    if (!userData) return <div>Loading...</div>;

    switch (activeTab) {
      case "home":
        return (
          <>
            <DoctorHome userProfile={userData} appointments={appointments} />
          </>
        );
      case "appointments":
        return <DoctorAppointments appointments={appointments} />;
      case "profile":
        return <DoctorProfile userData={userData} />;
      case "messages":
        return <div className="text-gray-500">Messages tab coming soon...</div>;
      case "logout": 
        return <div className="text-red-500">Logging out...</div>;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        sidebarItems={sidebarItems}
        setActiveTab={setActiveTab}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1 flex flex-col">
        <Topbar userRole={userData ? userData.name : "Doctor"} />
        <div className="p-6 overflow-auto h-[calc(100vh-4rem)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
