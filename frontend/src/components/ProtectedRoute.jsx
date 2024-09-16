/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const ProtectedRoute = ({ admin = false }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  const loggedIn = isLoggedIn();
  if (admin) {
    if (!loggedIn) {
      return <Navigate to="/auth" replace />;
    }
    if (loggedIn && isAdmin()) {
      return <Outlet />;
    }
    <Navigate to="/" replace />;
  } else {
    return loggedIn ? <Outlet /> : <Navigate to="/auth" replace />;
  }
};

export default ProtectedRoute;
