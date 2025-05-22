import React, { useState, useRef } from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";

const PatientProfile = ({ userProfile, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: userProfile.name,
    age: userProfile.age,
    gender: userProfile.gender || "",
    email: userProfile.email || "",
    phone: userProfile.phone || "",
    medicalConditions: userProfile.medicalConditions || [],
    emergencyContact: {
      name: userProfile.emergencyContact?.name || "",
      phone: userProfile.emergencyContact?.phone || "",
      relation: userProfile.emergencyContact?.relation || "",
    },
    image: userProfile.image || null,
  });
  const [preview, setPreview] = useState(userProfile.image || null);
  const fileInputRef = useRef(null);
  const [newCondition, setNewCondition] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEmergencyChange = (e) => {
    setProfile({
      ...profile,
      emergencyContact: {
        ...profile.emergencyContact,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setProfile({
        ...profile,
        medicalConditions: [...profile.medicalConditions, newCondition.trim()],
      });
      setNewCondition("");
    }
  };

  const handleRemoveCondition = (cond) => {
    setProfile({
      ...profile,
      medicalConditions: profile.medicalConditions.filter(c => c !== cond),
    });
  };

  const handleSave = () => {
    setEditMode(false);
    if (onUpdate) onUpdate(profile);
    // Optionally, send updated profile to backend here
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col items-center mb-4 relative group">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
          />
        ) : (
          <FaUserCircle className="text-6xl text-blue-400" />
        )}
        {editMode && (
          <>
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition"
              onClick={() => fileInputRef.current.click()}
              title="Change profile picture"
            >
              <FaCamera />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </>
        )}
      </div>
      <h2 className="text-2xl font-semibold">Profile & Health Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.name}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.name}
                  readOnly
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              {editMode ? (
                <input
                  type="number"
                  name="age"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.age}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.age}
                  readOnly
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              {editMode ? (
                <input
                  type="text"
                  name="gender"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.gender}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.gender}
                  readOnly
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.email}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.email}
                  readOnly
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              {editMode ? (
                <input
                  type="text"
                  name="phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.phone}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.phone}
                  readOnly
                />
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Medical Conditions</h3>
          <div className="flex flex-wrap gap-2">
            {profile.medicalConditions.map(condition => (
              <span key={condition} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
                {condition}
                {editMode && (
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveCondition(condition)}
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          {editMode && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                className="border rounded px-2 py-1"
                value={newCondition}
                onChange={e => setNewCondition(e.target.value)}
                placeholder="Add condition"
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleAddCondition}
              >
                Add
              </button>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Emergency Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.emergencyContact.name}
                  onChange={handleEmergencyChange}
                />
              ) : (
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.emergencyContact.name}
                  readOnly
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              {editMode ? (
                <input
                  type="text"
                  name="phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.emergencyContact.phone}
                  onChange={handleEmergencyChange}
                />
              ) : (
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.emergencyContact.phone}
                  readOnly
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Relation</label>
              {editMode ? (
                <input
                  type="text"
                  name="relation"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.emergencyContact.relation}
                  onChange={handleEmergencyChange}
                />
              ) : (
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={profile.emergencyContact.relation}
                  readOnly
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {editMode ? (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
        {editMode && (
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardProfile;