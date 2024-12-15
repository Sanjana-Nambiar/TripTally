import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Layout = ({ user, children }) => {
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      window.location.href = '/login'; // Redirect to login page
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div>
      <header className="bg-dark text-white py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">Travel Budgeting Tool</h1>
          <nav>
            <Link to="/" className="text-white me-3">Home</Link>
            <Link to="/trip/add" className="text-white me-3">Add Trip</Link>
            {user && <button onClick={handleLogout} className="btn btn-link text-white">Logout</button>}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-dark text-center py-3 mt-5 text-white">
        <p className="mb-0">&copy; 2024 Travel Budgeting Tool</p>
      </footer>
    </div>
  );
};

export default Layout;
