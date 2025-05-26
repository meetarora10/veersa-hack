import { Routes, Route, Navigate, useLocation, useParams, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Patient_dash from './pages/Patient_dash';
import Doctor_dash from './pages/Doctor_dash';
import SearchDoctor from './pages/SearchDoctor';
import BookAppointment from './pages/BookAppointment';
import SessionWrapper from './components/SessionWrapper';
import Home from './pages/Home';

function MeetRouteWrapper() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = location.state?.userRole;
  const DAILY_DOMAIN = 'https://tealth.daily.co';
  const roomUrl = location.state?.meetingUrl || `${DAILY_DOMAIN}/${roomId}`;

  const handleLeaveCall = () => {
    if (userRole === 'doctor') {
      navigate('/doctor_dashboard');
    } else if (userRole === 'patient') {
      navigate('/patient_dashboard');
    }
  };

  if (!roomUrl) return <div className="text-center mt-10">Loading meeting...</div>;

  return <SessionWrapper roomUrl={roomUrl} userRole={userRole} onLeaveCall={handleLeaveCall} />;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Patient Routes */}
      <Route
        path="/patient_dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <Patient_dash />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search-doctor"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <SearchDoctor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-appointment/:doctorId"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <BookAppointment />
          </ProtectedRoute>
        }
      />

      {/* Protected Doctor Routes */}
      <Route
        path="/doctor_dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <Doctor_dash />
          </ProtectedRoute>
        }
      />

      {/* Protected Meeting Route */}
      <Route
        path="/meet/:roomId"
        element={
          <ProtectedRoute>
            <MeetRouteWrapper />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
