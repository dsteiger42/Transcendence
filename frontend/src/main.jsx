import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LegalFooter from './components/Legal/LegalFooter';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <LegalFooter />
  </React.StrictMode>
);
