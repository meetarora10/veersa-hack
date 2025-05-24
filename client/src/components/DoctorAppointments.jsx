import React, { useState } from "react";

const DoctorAppointments = ({ appointments: allAppointments }) => {
  const [appointments, setAppointments] = useState(allAppointments);

  const now = new Date();

  const upcomingAppointments = appointments.filter((appointment) => {
    const apptDateTime = new Date(`${appointment.date}T${appointment.time}`);
    return apptDateTime > now;
  });

  const historyAppointments = appointments.filter((appointment) => {
    const apptDateTime = new Date(`${appointment.date}T${appointment.time}`);
    return apptDateTime <= now;
  });

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert(data.message || "Failed to cancel appointment.");
      }
    } catch (err) {
      alert("Error cancelling appointment.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Appointments</h2>
        <div className="grid grid-cols-1 gap-4">
          {upcomingAppointments.length === 0 && (
            <div className="text-gray-500 italic">No upcoming appointments.</div>
          )}
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{appointment.doctor}</h3>
                <p className="text-gray-600">{appointment.specialty}</p>
                <p className="text-gray-600">{appointment.date} at {appointment.time}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm ${appointment.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {appointment.status}
                </span>
                {appointment.status === "Confirmed" && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Join Call
                  </button>
                )}
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleCancel(appointment.id)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Consultation History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left">Doctor</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Documents</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {historyAppointments.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-gray-500 italic p-4 text-center">
                    No past consultations.
                  </td>
                </tr>
              )}
              {historyAppointments.map(appointment => (
                <tr key={appointment.id} className="border-t">
                  <td className="p-4">{appointment.doctor}</td>
                  <td className="p-4">{appointment.date}</td>
                  <td className="p-4">
                    {appointment.prescription && (
                      <button className="text-blue-600 hover:text-blue-800 mr-2">
                        Prescription
                      </button>
                    )}
                  </td>
                  <td className="p-4">
                    {appointment.rating ?
                      <span className="text-yellow-500">{'★'.repeat(appointment.rating)}</span> :
                      <button className="text-blue-600 hover:text-blue-800">Rate</button>
                    }
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;