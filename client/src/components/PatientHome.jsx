import React from "react";
import { format } from "date-fns";

const PatientHome = ({ userProfile, appointments }) => (
  <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold">Hi {userProfile.name} 👋</h2>
      <div className="text-sm text-gray-600">{format(new Date(), "EEEE, MMMM d")}</div>
    </div>
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-2">Next Appointment</h3>
      {appointments[0] && (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{appointments[0].doctor}</p>
            <p className="text-gray-600">{appointments[0].specialty}</p>
            <p className="text-gray-600">{appointments[0].date} at {appointments[0].time}</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Join Call
          </button>
        </div>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold">Upcoming</h4>
        <p className="text-2xl font-bold">{appointments.length}</p>
        <p className="text-gray-600">Appointments</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold">Pending</h4>
        <p className="text-2xl font-bold">
          {appointments.filter(a => a.status === "Pending").length}
        </p>
        <p className="text-gray-600">Reviews</p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold">Messages</h4>
        <p className="text-2xl font-bold">3</p>
        <p className="text-gray-600">Unread</p>
      </div>
    </div>
  </div>
);

export default PatientHome;