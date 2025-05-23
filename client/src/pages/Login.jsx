import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
            setSuccess(true);
            setMessage('Login successful!');
            setFormData({
                email: '',
                password: '',
            })
          if (data.id) {
                localStorage.setItem("userId", data.id);
            }

            if(data.role === 'doctor'){
                navigate('/doctor_dashboard');
                
            } else if(data.role === 'patient'){
                navigate('/patient_dashboard');
            }
        } else {
            setSuccess(false);
            setMessage(data.message || 'Login failed');
        }

    }
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
        {message && (
            <div className={`p-3 mb-4 rounded-md text-sm ${
            success 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
            {message}
            </div>
        )}
      <form>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button type="submit" onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium">Login</button>
      </form>
    </div>
  )
}

export default Login
