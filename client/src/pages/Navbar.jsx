import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // On mount, read auth info from localStorage
  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
  }, [location]); // update on route change

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => location.pathname === path;

  // Common nav links visible to logged-in users depending on role
  const navLinksByRole = {
    USER: [
      { path: '/', label: 'Home' },
     
      { path: '/user', label: 'User Dashboard'},
    ],
    ADMIN: [
      { path: '/', label: 'Home'},
      { path: '/adminDashboard', label: 'Admin' },
    ],
    STORE_OWNER: [
      { path: '/', label: 'Home' },
      { path: '/ownerDashboard', label: 'Owner' },
    ],
  };

  // Auth links for non-logged in users
  const authLinks = [
    { path: '/login', label: 'Login' },
    { path: '/signup', label: 'Sign Up' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Pick nav links based on role, or empty if no token
  const navLinks = token ? navLinksByRole[role] || [] : [];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">StoreApp</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200 ${
                    isActive(path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Links or Logout - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!token ? (
              authLinks.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200 ${
                    isActive(path)
                      ? 'bg-blue-600 text-white'
                      : path === '/signup'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-gray-700 hover:text-blue-600 border border-gray-300 hover:border-blue-600'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              ))
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
            {navLinks.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 transition-colors duration-200 ${
                  isActive(path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-white'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            ))}

            {!token ? (
              authLinks.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 transition-colors duration-200 ${
                    isActive(path)
                      ? 'bg-blue-600 text-white'
                      : path === '/signup'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              ))
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
