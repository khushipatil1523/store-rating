import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Where user was trying to go
  const from = location.state?.from?.pathname || '/';

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/.test(password);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!validateEmail(formData.email)) {
      setError('Invalid email format.');
      return;
    }
    if (!validatePassword(formData.password)) {
      setError('Password must be 8-16 chars, include at least one uppercase and one special character.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('userName', res.data.name);
      setSuccess('Login successful!');
      
      if (from === '/' || from === '/login' || from === '/signup') {
        if (res.data.role === 'ADMIN') {
          navigate('/adminDashboard', { replace: true });
        } else if (res.data.role === 'STORE_OWNER') {
          navigate('/ownerDashboard', { replace: true });
        } else {
          navigate('/user', { replace: true });
        }
      } else {
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

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
              type={showPassword ? "text" : "password"}
              name="password"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(prev => !prev)}
              className="cursor-pointer"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-700 cursor-pointer">
              Show Password
            </label>
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
