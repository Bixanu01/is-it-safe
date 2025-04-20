// File: src/components/ScannerPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ScannerPage({ title, children }) {
  return (
    <div className="container">
      <nav style={{ marginBottom: '1rem', textAlign: 'right' }}>
        <Link to="/"><button className="scan-button">🏠 Home</button></Link>
      </nav>
      <h1 style={{ marginBottom: '1rem' }}>{title}</h1>
      {children}
    </div>
  );
}
