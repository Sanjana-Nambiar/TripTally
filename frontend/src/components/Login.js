import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
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

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('/api/login', { username, password }, { withCredentials: true })
      .then(() => {
        axios.get('/api/session', { withCredentials: true })
          .then((response) => {
            setUser(response.data.user);
            navigate('/');
          })
          .catch(() => setMessage('Login successful, but session check failed.'));
      })
      .catch((error) => setMessage(error.response?.data?.error || 'Login failed'));
  };

  return (
    <AuthLayout imageSrc="/travel.jpg">
      <h2 style={{ color: '#333', fontWeight: 'bold', marginBottom: '1rem' }}>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          style={inputStyles}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" style={buttonStyles}>Login</button>
      </form>
      <p style={{ marginTop: '1rem', color: '#4e94db' }}>
        Don't have an account? <a href="/register" style={{ color: '#ffd700' }}>Register here</a>
      </p>
      {message && <p style={{ color: 'red', marginTop: '1rem' }}>{message}</p>}
    </AuthLayout>
  );
};

export default Login;
