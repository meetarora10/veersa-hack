import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Topbar({ userRole, userData }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-4">
          {userData?.image ? (
            <img
              src={`${backendUrl}${userData.image}`}
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-10 h-10 text-blue-300" />
          )}
          <span className="font-medium">{userData?.name || userRole}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <FaBell size={20} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          {/* <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiSettings size={20} />
          </button> */}
        </div>
      </div>
    </header>
  );
}

export default Topbar;