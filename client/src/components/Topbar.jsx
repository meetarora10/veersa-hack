import React from "react";
import { FaBell } from "react-icons/fa";

function Topbar({ userRole }) {
  return (
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
  );
}

export default Topbar;