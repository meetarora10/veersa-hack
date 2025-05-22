import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const DoctorProfile = ({ userData, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: userData.name,
    age: userData.age,
    gender: userData.gender,
    specialization: userData.specialization,
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditMode(false);
    if (onUpdate) onUpdate(profile);
    // Optionally, send updated profile to backend here
  };

  return (
    <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center mx-auto">
      <div className="mb-4">
        <FaUserCircle className="text-6xl text-blue-400" />
      </div>
      {editMode ? (
        <>
          <input
            className="mb-2 p-2 border rounded w-full"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            className="mb-2 p-2 border rounded w-full"
            name="age"
            value={profile.age}
            onChange={handleChange}
            placeholder="Age"
            type="number"
          />
          <input
            className="mb-2 p-2 border rounded w-full"
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            placeholder="Gender"
          />
          <input
            className="mb-4 p-2 border rounded w-full"
            name="specialization"
            value={profile.specialization}
            onChange={handleChange}
            placeholder="Specialization"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            onClick={handleSave}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-2">{profile.name}</h3>
          <p className="text-gray-600 mb-1">Age: {profile.age}</p>
          <p className="text-gray-600 mb-1">Gender: {profile.gender}</p>
          <p className="text-gray-600 mb-4">Specialization: {profile.specialization}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
};

export default DoctorProfile;