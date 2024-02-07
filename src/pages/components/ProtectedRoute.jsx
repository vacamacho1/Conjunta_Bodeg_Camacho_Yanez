import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userToken'); // Cambia esto según tu lógica de autenticación

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
