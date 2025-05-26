import React, { useState, useEffect } from "react";
import axios from "axios";

function DoctorAvailableSlots({ doctorId }) {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const formatTime = (hourStr) => {
    const hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:00 ${ampm}`;
  };

  // Filter out past slots if selectedDate is today
  const filterPastSlots = (availableSlots, selectedDate) => {
    const todayStr = getTodayDate();
    if (selectedDate === todayStr) {
      const currentHour = new Date().getHours();
      return availableSlots.filter((slot) => parseInt(slot, 10) >= currentHour);
    }
    return availableSlots;
  };

  useEffect(() => {
    if (!doctorId || !selectedDate || selectedDate.trim() === "") {
      console.log("Skipping fetchSlots: missing doctorId or selectedDate");
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/available_slots?doctor_id=${doctorId}&date=${selectedDate}`
        );

        if (res.data.success) {
          // Filter slots for today to remove past times
          const filteredSlots = filterPastSlots(res.data.available_slots, selectedDate);
          setSlots(filteredSlots);
          console.log("Fetched and filtered slots:", filteredSlots);
        } else {
          setSlots([]);
          console.warn("No available slots:", res.data.message);
        }
      } catch (err) {
        setSlots([]);
        console.error("Error fetching slots:", err);
      }
    };

    fetchSlots();
  }, [selectedDate, doctorId]);

  return (
    <div className="p-4 border rounded shadow-md">
      <label className="block mb-2">
        Select Date:{" "}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded"
          min={getTodayDate()}
        />
      </label>

      {slots.length > 0 ? (
        <ul className="list-disc list-inside">
          {slots.map((slot, index) => (
            <li key={index}>{formatTime(slot)}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No available slots on this date.</p>
      )}
    </div>
  );
}

export default DoctorAvailableSlots;
