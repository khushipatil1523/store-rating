import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoreList from './pages/User/StoreList';
import HomePage from './pages/HomePage';
import Signup from './auth/Signup';
import Login from './auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import OwnerDashboard from './pages/StoreOwner/OwnerDashboard';
import UserDashboard from './pages/User/UserDashboard';
import Navbar from './pages/Navbar'; // Adjust path as needed
import "./index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/stores" element={<StoreList />} />
          <Route path="/adminDashboard" element={<AdminDashboard/>}/>
          <Route path='/ownerDashboard' element={<OwnerDashboard/>}/>
          <Route path='/user' element={<UserDashboard/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;