import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { BsLayoutSidebar } from "react-icons/bs";

const Sidebar = ({ isOpen, activeTab, setActiveTab, sidebarItems, toggleSidebar }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login');
    } else {
      alert('Logout failed. Please try again.');
    }
  };

  const handleTabClick = (tabId) => {
    if (tabId === 'logout') {
      handleLogout();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className={`${isOpen ? "w-64" : "w-20"} bg-card dark:bg-dark-card transition-all duration-300 p-4 border-r border-border dark:border-dark-border`}>
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={toggleSidebar}
          className="text-accent dark:text-dark-accent p-2 rounded-lg hover:bg-secondary dark:hover:bg-dark-secondary"
        >
          <BsLayoutSidebar size={28} />
        </button>
      </div>
      <nav>
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`w-full flex items-center p-3 mb-2 rounded-lg transition-all duration-200
              ${activeTab === item.id
                ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400"
                : "text-accent hover:bg-secondary dark:hover:bg-dark-secondary"
              }`}
            style={{
              position: "relative",
              fontWeight: activeTab === item.id ? "bold" : "normal"
            }}
          >
            {/* Active indicator bar */}
            {activeTab === item.id && (
              <span className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r-lg"></span>
            )}
            <span className="text-xl ml-2">{item.icon}</span>
            {isOpen && <span className="ml-3">{item.label}</span>}
          </button>
        ))}
       
      </nav>
    </div>
  );
};

export default Sidebar;