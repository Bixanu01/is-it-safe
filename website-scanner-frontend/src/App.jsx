import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhoneCheck from './PhoneCheck';
import EmailCheck from './EmailCheck';
import WebsiteScan from './WebsiteScan';
import AppScan from './AppScan';
import './app.css';

function MainPage() {
  return (
    <div className="container">
      <h1>🔒 Is It Safe?</h1>
      <div className="main-buttons">
        <RouterLink to="/check-phone" label="Check Phone" />
        <RouterLink to="/check-email" label="Check Email" />
        <RouterLink to="/scan-website" label="Scan Website" />
        <RouterLink to="/scan-app" label="Scan App" />
      </div>
    </div>
  );
}

// small helper to keep code DRY
function RouterLink({ to, label }) {
  return (
    <a href={to} style={{ textDecoration: 'none' }}>
      <button className="scan-button">{label}</button>
    </a>
  );
}

function NotFound() {
  return (
    <div className="container">
      <h2>Page Not Found</h2>
      <a href="/" style={{ textDecoration: 'none' }}>
        <button className="scan-button">Go Home</button>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/check-phone" element={<PhoneCheck />} />
        <Route path="/check-email" element={<EmailCheck />} />
        <Route path="/scan-website" element={<WebsiteScan />} />
        <Route path="/scan-app" element={<AppScan />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
