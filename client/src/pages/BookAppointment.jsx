import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaStethoscope,
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUserMd,
} from "react-icons/fa";
import SquarePaymentForm from "../components/SquarePaymentForm";
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Get current time in HH:MM format (24-hour)
const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // HH:MM
};
const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const patient_id = localStorage.getItem("userId");

  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    doctor_id: doctorId || "",
    specialty: "",
    date: "",
    time: "",
  });
  const [step, setStep] = useState("details");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  // Fetch doctor info
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        let res = await fetch(
          `http://localhost:5000/api/doctors?id=${doctorId}`
        );
        let data = await res.json();
        let doc = Array.isArray(data)
          ? data.find((d) => String(d.id) === String(doctorId))
          : data;
        if (doc) {
          setDoctor(doc);
          setFormData((prev) => ({
            ...prev,
            doctor_id: doctorId,
            specialty: doc.specialization || "",
          }));
        }
      } catch (err) {
        setDoctor(null);
      }
    };
    fetchDoctor();
    
  }, [doctorId]);
  useEffect(() => {
  // Fetch available slots when date changes
  const fetchSlots = async () => {
    if (!formData.date) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/available_slots?doctor_id=${doctorId}&date=${formData.date}`
      );
      if (res.data.success && res.data.available_slots.length > 0) {
        setAvailableSlots(res.data.available_slots);
      } else {
        setAvailableSlots([]);
        alert("No available slots for this date");
        console.log("No available slots:", res.data.error);
      }
    } catch (err) {
      setAvailableSlots([]);
      console.error("Error fetching slots:", err);
    }
  };

  fetchSlots();
}, [formData.date, doctorId]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Appointment Details Form
  const renderDetailsForm = () => (
    <form
      onSubmit={e => {
        e.preventDefault();
        setStep("payment");
      }}
      className="space-y-6"
    >
      {/* Specialty */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Specialty
        </label>
        <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50">
          <FaStethoscope className="text-gray-500 mr-2" />
          <input
            name="specialty"
            type="text"
            value={formData.specialty}
            onChange={handleChange}
            className="w-full focus:outline-none bg-transparent"
            placeholder="e.g. Cardiology"
            required
            readOnly
          />
        </div>
      </div>
      {/* Doctor ID (readonly) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Doctor ID
        </label>
        <input
          name="doctor_id"
          value={formData.doctor_id}
          readOnly
          className="w-full border px-3 py-2 rounded-lg shadow-sm bg-gray-100 text-gray-600"
        />
      </div>
      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50">
          <FaCalendarAlt className="text-gray-500 mr-2" />
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full focus:outline-none bg-transparent"
            required
            min={getTodayDate()} // Prevent past dates
          />
        </div>
      </div>
      {/* Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time
        </label>
        <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50">
            <FaClock className="text-gray-500 mr-2" />
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg shadow-sm bg-gray-50"
            >
              <option value="">Select a time slot</option>
              {availableSlots.map((slot, idx) => (
                <option key={idx} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
      </div>
      {/* Pay Button */}
      <button
        type="submit"
        disabled={
          !formData.specialty ||
          !formData.doctor_id ||
          !formData.date ||
          !formData.time ||
          !patient_id
        }
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold shadow transition-all disabled:opacity-50"
      >
        Pay ₹{doctor?.price?.toFixed(2)} to process
      </button>
    </form>
  );

  // Step 2: Payment Form
  const renderPaymentForm = () => (
    <div>
      <SquarePaymentForm
        amount={doctor.price}
        onSuccess={() => {
          setPaymentSuccess(true);
          setPaymentError("");
          setStep("confirm");
        }}
        onError={(error) => {
          setPaymentError(error);
          setPaymentSuccess(false);
        }}
        disabled={isLoading}
      />
      {paymentError && (
        <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 border border-red-200 rounded">
          {paymentError}
        </div>
      )}
    </div>
  );

  // Step 3: Confirm Booking
  const handleBook = async (e) => {
    e.preventDefault();

    // Validate payment was successful before proceeding
    if (!paymentSuccess) {
      alert("Please complete payment before confirming booking");
      setStep("payment");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/appointments", {
        ...formData,
        patient_id,
        doctor_id: doctor.id,
        payment_status: 'completed',
        amount: doctor.price
      });

      if (res.data.success) {
        alert(res.data.message || "Booking confirmed successfully!");
        navigate("/patient_dashboard");
      } else {
        throw new Error(res.data.error || "Booking failed");
      }
    } catch (err) {
      console.error("Booking error:", err, err.response?.data);
      alert("Booking failed: " + (err.response?.data?.error || err.message || "Unknown error"));
      setPaymentSuccess(false);
      setStep("payment");
    } finally {
      setIsLoading(false);
    }
  };

  const renderConfirm = () => (
    <form onSubmit={handleBook} className="space-y-6">
      {paymentSuccess && (
        <div className="text-green-700 font-semibold text-center mb-2 p-3 bg-green-50 border border-green-200 rounded">
          ✓ Payment successful!
        </div>
      )}

      {/* Display booking summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Booking Summary</h3>
        <p>Doctor: {doctor.name}</p>
        <p>Amount: ₹{doctor.price}</p>
        {/* Add other booking details */}
      </div>

      <button
        type="submit"
        disabled={isLoading || !paymentSuccess}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 rounded-lg font-semibold shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Confirming..." : "Confirm Booking"}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full space-y-8 border border-blue-100">
        <button
          type="button"
          className="flex items-center text-blue-700 hover:text-blue-900 mb-2 transition"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-4 tracking-tight">
          Book Appointment
        </h2>
        {doctor ? (
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 mb-2 shadow">
              <img
                src={
                  doctor.photoUrl ||
                  "https://cdn-icons-png.flaticon.com/512/3870/3870822.png"
                }
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <FaUserMd className="text-blue-600" /> {doctor.name}
            </h3>
            <div className="flex items-center gap-2 text-blue-700 mt-1">
              <FaStethoscope />
              <span className="font-medium">{doctor.specialization}</span>
            </div>
            {doctor.experience && (
              <div className="text-gray-600 mt-1 text-sm">
                <span className="font-semibold">Experience:</span>{" "}
                {doctor.experience}
              </div>
            )}
            {doctor.location && (
              <div className="flex items-center gap-1 text-gray-600 mt-1 text-sm">
                <FaMapMarkerAlt /> {doctor.location}
              </div>
            )}
            {doctor.price && (
              <div className="text-blue-700 mt-1 font-semibold">
                Consultation Fee: ₹{doctor.price.toFixed(2)}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 text-gray-500 text-center">
            Loading doctor info...
          </div>
        )}

        {/* Step-based rendering */}
        <div className="booking-container">
          {step === "details" && renderDetailsForm()}
          {step === "payment" && renderPaymentForm()}
          {step === "confirm" && renderConfirm()}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;