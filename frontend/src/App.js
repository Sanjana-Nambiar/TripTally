import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AddTrip from './components/AddTrip';
import TripDetails from './components/TripDetails';
import ProtectedRoute from './components/ProtectedRoute';
import AddExpense from './components/AddExpense';

// Ensure Axios sends cookies
axios.defaults.withCredentials = true;

const App = () => {
  const [user, setUser] = useState(undefined); // Set initial state to undefined for loading

  // Check session on app load
  useEffect(() => {
    axios.get('/api/session', { withCredentials: true })
      .then((response) => {
        console.log('Session check success:', response.data.user);
        setUser(response.data.user); // Set the user state
      })
      .catch((error) => {
        console.error('Session check failed:', error);
        setUser(null); // User is not authenticated
      });
  }, []);

  if (user === undefined) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user}>
                <Home user={user} />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/trip/add"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user}>
                <AddTrip />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/trip/:slug"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user}>
                <TripDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip/:slug/add-expense"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user}>
                <AddExpense />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
