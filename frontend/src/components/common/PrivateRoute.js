import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export default PrivateRoute;