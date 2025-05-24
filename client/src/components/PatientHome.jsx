import React from "react";
import { format, isToday, isAfter, isBefore, addMinutes } from "date-fns";
import SearchDoctor from "../pages/SearchDoctor";

const PatientHome = ({ userProfile, appointments }) => {
  const now = new Date();

  // Only consider appointments in the future
  const upcomingAppointments = appointments
    .filter(a => {
      const apptDateTime = new Date(`${a.date}T${a.time}`);
      return apptDateTime > now;
    })
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const nextAppointment = upcomingAppointments[0];

  let joinEnabled = false;
  if (nextAppointment) {
    const apptDateTime = new Date(`${nextAppointment.date}T${nextAppointment.time}`);
    const fiveMinBefore = addMinutes(apptDateTime, -5);
    joinEnabled =
      isToday(apptDateTime) &&
      isAfter(now, fiveMinBefore) &&
      isBefore(now, addMinutes(apptDateTime, 60));
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-3xl font-bold">Hi {userProfile.name} 👋</h2>
        <div className="text-sm text-gray-600">{format(new Date(), "EEEE, MMMM d")}</div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Next Appointment</h3>
        {nextAppointment ? (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  nextAppointment.photoUrl ||
                  "https://cdn-icons-png.flaticon.com/512/3870/3870822.png"
                }
                alt={nextAppointment.doctor}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow"
              />
              <div>
                <p className="font-medium text-lg text-blue-900">{nextAppointment.doctor}</p>
                <p className="text-blue-700">{nextAppointment.specialty}</p>
                <p className="text-gray-600">
                  {format(new Date(`${nextAppointment.date}T${nextAppointment.time}`), "PPPp")}
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  <span className="font-semibold">Note:</span> "Join Call" button will be active 5 minutes before the meeting time.
                </p>
              </div>
            </div>
            <button
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                joinEnabled
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!joinEnabled}
            >
              Join Call
            </button>
          </div>
        ) : (
          <div className="text-gray-500 italic">No appointment booked.</div>
        )}
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Find a Doctor</h3>
        <SearchDoctor />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold">Upcoming</h4>
          <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
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
};

export default PatientHome;