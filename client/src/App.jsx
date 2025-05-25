import { Routes, Route, useLocation, useParams } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Patient_dash from "./pages/Patient_dash";
import Doctor_dash from "./pages/Doctor_dash";
import BookAppointment from './pages/BookAppointment';
import SessionWrapper from './components/SessionWrapper'; 

function MeetRouteWrapper() {
  const { roomId } = useParams();
  const location = useLocation();
  const userRole = location.state?.userRole;
  const DAILY_DOMAIN = 'https://tealth.daily.co';
  const roomUrl = location.state?.meetingUrl || `${DAILY_DOMAIN}/${roomId}`;

  if (!roomUrl) return <div className="text-center mt-10">Loading meeting...</div>;

  return <SessionWrapper roomUrl={roomUrl} userRole={userRole} />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctor_dashboard" element={<Doctor_dash />} />
      <Route path="/patient_dashboard" element={<Patient_dash />} />
      <Route path="/meet/:roomId" element={<MeetRouteWrapper />} />
      <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
    </Routes>
  );
}

export default App;
