import React from "react";

function UpcomingAppointments({ appointments }) {
  return (
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
            {appointments.map((appointment) => (
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
  );
}

export default UpcomingAppointments;