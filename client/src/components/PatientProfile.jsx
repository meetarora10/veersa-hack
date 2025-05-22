import React from "react";

const DashboardProfile = ({ userProfile }) => (
  <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
    <h2 className="text-2xl font-semibold">Profile & Health Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={userProfile.name}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={userProfile.age}
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Medical Conditions</h3>
        <div className="flex flex-wrap gap-2">
          {userProfile.medicalConditions.map(condition => (
            <span key={condition} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {condition}
            </span>
          ))}
        </div>
        <button className="text-blue-600 hover:text-blue-800">
          + Add Condition
        </button>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Contact</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={userProfile.emergencyContact.name}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={userProfile.emergencyContact.phone}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardProfile;