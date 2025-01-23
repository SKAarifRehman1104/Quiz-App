import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component }) => {
  const token = localStorage.getItem('token');
  
  // Check if token exists and is valid
  const isTokenValid = () => {
    if (!token) return false;
    try {
      // Decode the token payload
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      // Check if token is expired
      if (!decoded || !decoded.exp) return false;
      return Date.now() < decoded.exp * 1000;
    } catch (error) {
      return false;
    }
  };

  return isTokenValid() ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
