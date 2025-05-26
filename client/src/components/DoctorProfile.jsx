import React, { useState, useRef } from "react";
import { User, Camera } from "lucide-react";

const DoctorProfile = ({ userData = {}, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: userData.name || '',
    age: userData.age || '',
    gender: userData.gender || '',
    specialization: userData.specialization || '',
    price: userData.price || '',
    image: userData.image || null,
  });
  const [preview, setPreview] = useState(userData.image || null);
  const fileInputRef = useRef(null);
  console.log(profile);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, image: file });
      setPreview(imageUrl);
    }
  };

  const handleSave = async () => {
    try {
      setEditMode(false);
      
      // Call parent component's update function
      if (onUpdate) {
        await onUpdate(profile);
      }
      
      console.log('Profile saved successfully:', profile);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      // Show detailed error message to user
      const errorMessage = error.message || 'Unknown error occurred';
      alert(`Failed to save profile: ${errorMessage}`);
      setEditMode(true); // Re-enable edit mode on error
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reset to original values
    setProfile({
      name: userData.name || '',
      age: userData.age || '',
      gender: userData.gender || '',
      specialization: userData.specialization || '',
      price: userData.price || '',
      image: userData.image || null,
    });
    setPreview(userData.image || null);
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center mx-auto">
      {/* Profile Image Section */}
      <div className="mb-6 relative group">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-blue-200 flex items-center justify-center">
            <User className="w-12 h-12 text-blue-400" />
          </div>
        )}
        {editMode && (
          <>
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              title="Change profile picture"
            >
              <Camera className="w-4 h-4" />
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

      {/* Profile Information */}
      {editMode ? (
        <div className="w-full space-y-3">
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Full Name"
          />
          <div className="flex gap-2">
            <input
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="age"
              value={profile.age}
              onChange={handleChange}
              placeholder="Age"
              type="number"
              min="18"
              max="100"
            />
            <select
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="specialization"
            value={profile.specialization}
            onChange={handleChange}
            placeholder="Specialization (e.g., Cardiology, Pediatrics)"
          />
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input
              className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="price"
              value={profile.price}
              onChange={handleChange}
              placeholder="Consultation Fee"
              type="number"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full text-center space-y-2">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {profile.name || 'No name provided'}
          </h3>
          <div className="space-y-2 text-gray-600">
            <p className="flex justify-between">
              <span className="font-medium">Age:</span>
              <span>{profile.age || 'Not specified'}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Gender:</span>
              <span>{profile.gender || 'Not specified'}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Specialization:</span>
              <span>{profile.specialization || 'Not specified'}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Consultation Fee:</span>
              <span className="text-green-600 font-semibold">
                {profile.price ? `₹${profile.price}` : 'Not set'}
              </span>
            </p>
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors mt-4"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
