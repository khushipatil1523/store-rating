import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // If user was redirected, this is where they wanted to go
  const from = location.state?.from?.pathname || '/';

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId);

      setSuccess('Login successful!');
      
      // Redirect to intended page OR default based on role
      if (from === '/' || from === '/login' || from === '/signup') {
        // If no special redirect, send by role
        if (res.data.role === 'ADMIN') {
          navigate('/adminDashboard', { replace: true });
        } else if (res.data.role === 'STORE_OWNER') {
          navigate('/ownerDashboard', { replace: true });
        } else {
          navigate('/user', { replace: true });
        }
      } else {
        // Redirect back to where they wanted
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-full max-w-md p-8 rounded-xl shadow-md border border-blue-300">
        <h2 className="text-2xl font-bold text-center text-black mb-6">Login</h2>
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}
        {success && <p className="text-green-600 text-center mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
