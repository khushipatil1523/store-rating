import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (!token) {
    // Not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Role not allowed
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in and role allowed
  return children;
};

export default RequireAuth;
