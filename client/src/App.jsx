import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoreList from './pages/User/StoreList';
import HomePage from './pages/HomePage';
import Signup from './auth/Signup';
import Login from './auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import OwnerDashboard from './pages/StoreOwner/OwnerDashboard';
import UserDashboard from './pages/User/UserDashboard';
import Navbar from './pages/Navbar'; // Adjust path as needed
import RequireAuth from './auth/RequireAuth'; // Add this!
import "./index.css";

function App() {
  // Logout function you can pass down to Navbar as prop if needed
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected admin route */}
          <Route
            path="/adminDashboard"
            element={
              <RequireAuth allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RequireAuth>
            }
          />

          {/* Protected store owner route */}
          <Route
            path="/ownerDashboard"
            element={
              <RequireAuth allowedRoles={['STORE_OWNER']}>
                <OwnerDashboard />
              </RequireAuth>
            }
          />

          {/* Protected user route */}
          <Route
            path="/user"
            element={
              <RequireAuth allowedRoles={['USER']}>
                <UserDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
