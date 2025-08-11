import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'USER',
  });

  
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};


    if (formData.name.length < 20) newErrors.name = 'Name must be at least 20 characters.';
    else if (formData.name.length > 60) newErrors.name = 'Name cannot exceed 60 characters.';

  
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format.';

    
    if (formData.address.length > 400) newErrors.address = 'Address cannot exceed 400 characters.';

   
    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>/?]).{8,16}$/;
    if (!pwdRegex.test(formData.password)) {
      newErrors.password = 
        'Password must be 8-16 chars, include at least one uppercase letter and one special character.';
    }

    setErrors(newErrors);

   
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; 

    try {
      const res = await axios.post('/api/auth/signup', formData);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Signup</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className={`w-full mb-1 p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <p className="text-red-600 text-sm mb-2">{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className={`w-full mb-1 p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="text-red-600 text-sm mb-2">{errors.email}</p>}

        <input
          type="text"
          name="address"
          placeholder="Address"
          className={`w-full mb-1 p-2 border rounded ${errors.address ? 'border-red-500' : ''}`}
          value={formData.address}
          onChange={handleChange}
          required
        />
        {errors.address && <p className="text-red-600 text-sm mb-2">{errors.address}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          className={`w-full mb-1 p-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password}</p>}

        <select
          name="role"
          className="w-full mb-4 p-2 border rounded"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="USER">User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
