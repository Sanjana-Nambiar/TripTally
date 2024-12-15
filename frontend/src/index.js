import React from 'react';
import { createRoot } from 'react-dom/client';
// import './styles.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // Create a React root
root.render(<App />); // Render the app
