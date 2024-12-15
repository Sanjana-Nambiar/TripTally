import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const inputStyles = {
    backgroundColor: '#f8f9fa', // Light background
    color: '#333', // Dark text
    border: '1px solid #ffd700', // Gold border
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '1rem',
    fontSize: '1rem',
    width: '100%',
  };

  const buttonStyles = {
    background: 'linear-gradient(45deg, #ffd700, #e5c100)',
    color: '#121212',
    fontWeight: 'bold',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '100%',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('/api/register', { username, email, password }, { withCredentials: true })
      .then(() => navigate('/'))
      .catch((error) => setMessage(error.response?.data?.error || 'Registration failed'));
  };

  return (
    <AuthLayout imageSrc="/travel.jpg">
      <h2 style={{ color: '#333', fontWeight: 'bold', marginBottom: '1rem' }}>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          style={inputStyles}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          style={inputStyles}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={inputStyles}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={buttonStyles}>Register</button>
      </form>
      <p style={{ marginTop: '1rem', color: '#4e94db' }}>
        Already have an account? <a href="/login" style={{ color: '#ffd700' }}>Login here</a>
      </p>
      {message && <p style={{ color: 'red', marginTop: '1rem' }}>{message}</p>}
    </AuthLayout>
  );
};

export default Register;
