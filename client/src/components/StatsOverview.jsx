import React from "react";
import { FaCalendar, FaUser, FaChartLine } from "react-icons/fa";

function StatsOverview() {
  return (
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
  );
}

export default StatsOverview;