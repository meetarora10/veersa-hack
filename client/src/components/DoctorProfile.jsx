import React, { useState, useRef } from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";

const DoctorProfile = ({ userData, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: userData.name,
    age: userData.age,
    gender: userData.gender,
    specialization: userData.specialization,
    image: userData.image || null,
  });
  const [preview, setPreview] = useState(userData.image || null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setEditMode(false);
    if (onUpdate) onUpdate(profile);
    // You can handle image upload to backend here if needed
  };

  return (
    <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center mx-auto">
      <div className="mb-4 relative group">
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