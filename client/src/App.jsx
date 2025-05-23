import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Patient_dash from "./pages/Patient_dash";
import Doctor_dash from "./pages/Doctor_dash";
import BookAppointment from './pages/BookAppointment';
import { Routes, Route } from 'react-router-dom'
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctor_dashboard" element={<Doctor_dash />} />
            <Route path="/patient_dashboard" element={<Patient_dash />} />
             <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
        </Routes>
    );
}

export default App;