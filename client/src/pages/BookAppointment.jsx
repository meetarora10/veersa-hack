// BookAppointment.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    doctor_id: "",
    specialty: "",
    date: "",
    time: "",
  });
  const patient_id = localStorage.getItem("userId");

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/appointments", {
        ...formData,
        patient_id,
      });
      alert(res.data.message);
    } catch (err) {
      alert("Booking failed");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="specialty" onChange={handleChange} placeholder="Specialty" />
      <input name="doctor_id" onChange={handleChange} placeholder="Doctor ID" />
      <input name="date" type="date" onChange={handleChange} />
      <input name="time" type="time" onChange={handleChange} />
      <button type="submit">Book</button>
    </form>
  );
};

export default BookAppointment;
