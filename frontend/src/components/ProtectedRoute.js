import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  // Show a loading indicator if user state hasn't resolved yet
  if (user === undefined) {
    console.log('User state is undefined. Waiting for session check to resolve.');
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('User is not authenticated. Redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  console.log('User is authenticated. Rendering protected content.');
  return children;
};

export default ProtectedRoute;
