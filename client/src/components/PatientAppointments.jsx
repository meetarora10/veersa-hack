import React from "react";

const PatientAppointments = ({ appointments }) => (
  <div className="space-y-6">
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Upcoming Appointments</h2>
      <div className="grid grid-cols-1 gap-4">
        {appointments.map((appointment) => (
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
              <button className="text-red-600 hover:text-red-800">
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
            {appointments.map(appointment => (
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

export default PatientAppointments;