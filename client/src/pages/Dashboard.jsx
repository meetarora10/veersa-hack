import React, { useState } from "react";
import { FaHome, FaCalendar, FaEnvelope, FaUser, FaBell, FaChartLine, FaFileMedical, FaClock } from "react-icons/fa";

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
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "w-64" : "w-20"} bg-card dark:bg-dark-card transition-all duration-300 p-4 border-r border-border dark:border-dark-border`}>
        <div className="flex items-center justify-between mb-8">
          <img
            src="https://images.unsplash.com/photo-1584982751601-97dcc096659c"
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-accent dark:text-dark-accent p-2 rounded-lg hover:bg-secondary dark:hover:bg-dark-secondary"
          >
            ≡
          </button>
        </div>
        <nav>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 mb-2 rounded-lg ${activeTab === item.id ? "bg-primary text-primary-foreground" : "text-accent hover:bg-secondary dark:hover:bg-dark-secondary"}`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* Topbar */}
        <div className="h-16 bg-card dark:bg-dark-card border-b border-border dark:border-dark-border flex items-center justify-between px-6">
          <h1 className="text-heading font-heading text-foreground dark:text-dark-foreground">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-accent dark:text-dark-accent hover:bg-secondary dark:hover:bg-dark-secondary rounded-lg">
              <FaBell />
            </button>
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
                alt="User"
                className="h-8 w-8 rounded-full"
              />
              <span className="ml-2 px-2 py-1 text-xs bg-secondary dark:bg-dark-secondary rounded-full">
                {userRole}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-auto h-[calc(100vh-4rem)]">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-card dark:bg-dark-card p-6 rounded-lg border border-border dark:border-dark-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent dark:text-dark-accent">Total Appointments</p>
                  <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground">24</h2>
                </div>
                <FaCalendar className="text-2xl text-primary" />
              </div>
            </div>
            <div className="bg-card dark:bg-dark-card p-6 rounded-lg border border-border dark:border-dark-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent dark:text-dark-accent">Total Patients</p>
                  <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground">156</h2>
                </div>
                <FaUser className="text-2xl text-primary" />
              </div>
            </div>
            <div className="bg-card dark:bg-dark-card p-6 rounded-lg border border-border dark:border-dark-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent dark:text-dark-accent">Revenue</p>
                  <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground">$2,845</h2>
                </div>
                <FaChartLine className="text-2xl text-primary" />
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-card dark:bg-dark-card rounded-lg border border-border dark:border-dark-border p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-foreground dark:text-dark-foreground">Upcoming Appointments</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border dark:border-dark-border">
                    <th className="pb-3 text-accent dark:text-dark-accent">Patient Name</th>
                    <th className="pb-3 text-accent dark:text-dark-accent">Date & Time</th>
                    <th className="pb-3 text-accent dark:text-dark-accent">Specialty</th>
                    <th className="pb-3 text-accent dark:text-dark-accent">Type</th>
                    <th className="pb-3 text-accent dark:text-dark-accent">Status</th>
                    <th className="pb-3 text-accent dark:text-dark-accent">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-border dark:border-dark-border">
                      <td className="py-4 text-foreground dark:text-dark-foreground">{appointment.patientName}</td>
                      <td className="py-4 text-foreground dark:text-dark-foreground">{appointment.dateTime}</td>
                      <td className="py-4 text-foreground dark:text-dark-foreground">{appointment.specialty}</td>
                      <td className="py-4 text-foreground dark:text-dark-foreground">{appointment.type}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${appointment.status === "upcoming" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-opacity-90">
                          Join Call
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card dark:bg-dark-card rounded-lg border border-border dark:border-dark-border p-6">
            <h2 className="text-xl font-bold mb-4 text-foreground dark:text-dark-foreground">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center p-4 border-b border-border dark:border-dark-border last:border-0">
                  <div className="h-10 w-10 rounded-full bg-secondary dark:bg-dark-secondary flex items-center justify-center mr-4">
                    <FaFileMedical className="text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground dark:text-dark-foreground font-medium">Medical Report Updated</p>
                    <p className="text-accent dark:text-dark-accent text-sm">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelehealthDashboard;