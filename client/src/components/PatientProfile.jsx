import React, { useState, useRef } from "react";
import { FaUserCircle, FaCamera, FaPlus, FaTimes } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL; 

const PatientProfile = ({ patientData, onUpdate }) => {
  if (!patientData) return <div>Loading...</div>;

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: patientData.name,
    age: patientData.age,
    gender: patientData.gender
      ? patientData.gender.charAt(0).toUpperCase() +
        patientData.gender.slice(1).toLowerCase()
      : "",
    email: patientData.email || "",
    phone: patientData.phone || "",
    medicalConditions: patientData.medicalConditions || [],
    emergencyContact: {
      name: patientData.emergencyContact?.name || "",
      phone: patientData.emergencyContact?.phone || "",
      relation: patientData.emergencyContact?.relation || "",
    },
    image: patientData.image || null,
  });
  const [preview, setPreview] = useState(patientData.image || null);
  const fileInputRef = useRef(null);
  const [newCondition, setNewCondition] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

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
      medicalConditions: profile.medicalConditions.filter((c) => c !== cond),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("user_id", patientData.id || patientData._id);
      formData.append("name", profile.name);
      formData.append("age", profile.age);
      formData.append("gender", profile.gender);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append(
        "medicalConditions",
        JSON.stringify(profile.medicalConditions)
      );
      formData.append(
        "emergencyContact",
        JSON.stringify(profile.emergencyContact)
      );
      if (profile.image && typeof profile.image !== "string") {
        formData.append("image", profile.image);
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patient/update_profile_form`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setEditMode(false);
        if (onUpdate) onUpdate(profile);
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (err) {
      alert("Error updating profile.");
    }
    setSaving(false);
  };

  const loadImageWithAuth = async (imagePath) => {
    if (!imagePath) return null;
    try {
      const response = await fetch(`${backendUrl}${imagePath}`, {
        credentials: 'include',
        headers: {
          'Accept': 'image/*'
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } else if (response.status === 401 || response.status === 403) {
        console.error('Authentication failed for image:', response.status);
        return null;
      }
      return null;
    } catch (error) {
      console.error('Error loading image:', error);
      return null;
    }
  };

  React.useEffect(() => {
    if (profile.image && typeof profile.image === 'string') {
      loadImageWithAuth(profile.image).then(url => {
        setImageUrl(url);
      });
    }
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [profile.image]);

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl max-w-3xl mx-auto my-6">
      <div className="flex flex-col items-center mb-6 relative group">
        <div className="relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-200 shadow-md"
            />
          ) : (
            <FaUserCircle className="w-28 h-28 sm:w-32 sm:h-32 text-blue-300" />
          )}
          {editMode && (
            <>
              <button
                type="button"
                className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition"
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
      </div>
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        Profile & Health Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={profile.name}
            disabled={!editMode}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${
              editMode
                ? "border-blue-400 bg-white"
                : "border-gray-200 bg-gray-100"
            } focus:outline-none focus:ring-2 focus:ring-blue-300`}
          />
        </div>
        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={profile.age}
            disabled={!editMode}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${
              editMode
                ? "border-blue-400 bg-white"
                : "border-gray-200 bg-gray-100"
            } focus:outline-none focus:ring-2 focus:ring-blue-300`}
          />
        </div>
        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={profile.gender}
            disabled={!editMode}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${
              editMode
                ? "border-blue-400 bg-white appearance-auto"
                : "border-gray-200 bg-gray-100 appearance-none"
            } focus:outline-none focus:ring-2 focus:ring-blue-300`}
            style={!editMode ? { pointerEvents: "none" } : {}}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={profile.email}
            disabled={!editMode}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${
              editMode
                ? "border-blue-400 bg-white"
                : "border-gray-200 bg-gray-100"
            } focus:outline-none focus:ring-2 focus:ring-blue-300`}
          />
        </div>
        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            disabled={!editMode}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${
              editMode
                ? "border-blue-400 bg-white"
                : "border-gray-200 bg-gray-100"
            } focus:outline-none focus:ring-2 focus:ring-blue-300`}
          />
        </div>
        {/* Medical Conditions */}
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-1">
            Medical Conditions
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.medicalConditions.map((cond, idx) => (
              <span
                key={idx}
                className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {cond}
                {editMode && (
                  <button
                    type="button"
                    className="ml-2 text-blue-400 hover:text-red-500"
                    onClick={() => handleRemoveCondition(cond)}
                  >
                    <FaTimes size={12} />
                  </button>
                )}
              </span>
            ))}
          </div>
          {editMode && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add condition"
                className="flex-1 px-3 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={handleAddCondition}
              >
                <FaPlus />
              </button>
            </div>
          )}
        </div>
        {/* Emergency Contact */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-blue-700 mb-1">
            Emergency Contact
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              name="name"
              value={profile.emergencyContact.name}
              disabled={!editMode}
              onChange={handleEmergencyChange}
              placeholder="Name"
              className={`w-full px-3 py-2 rounded-lg border ${
                editMode
                  ? "border-blue-400 bg-white"
                  : "border-gray-200 bg-gray-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-300`}
            />
            <input
              type="tel"
              name="phone"
              value={profile.emergencyContact.phone}
              disabled={!editMode}
              onChange={handleEmergencyChange}
              placeholder="Phone"
              className={`w-full px-3 py-2 rounded-lg border ${
                editMode
                  ? "border-blue-400 bg-white"
                  : "border-gray-200 bg-gray-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-300`}
            />
            <input
              type="text"
              name="relation"
              value={profile.emergencyContact.relation}
              disabled={!editMode}
              onChange={handleEmergencyChange}
              placeholder="Relation"
              className={`w-full px-3 py-2 rounded-lg border ${
                editMode
                  ? "border-blue-400 bg-white"
                  : "border-gray-200 bg-gray-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-300`}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
        {editMode ? (
          <>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-400 transition"
              onClick={() => setEditMode(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
