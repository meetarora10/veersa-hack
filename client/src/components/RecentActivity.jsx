import React from "react";
import { FaFileMedical } from "react-icons/fa";

function RecentActivity() {
  return (
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
  );
}

export default RecentActivity;