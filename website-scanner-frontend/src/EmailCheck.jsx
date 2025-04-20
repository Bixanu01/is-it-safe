import React, { useState } from 'react';
import axios from 'axios';
import ScannerPage from './components/ScannerPage';

export default function EmailCheck() {
  const [email, setEmail] = useState('');
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      const res = await axios.post('http://localhost:3001/check-email', { email });
      setData(res.data);
    } catch {
      setErr('Lookup failed — please verify the address.');
    }
    setLoading(false);
  };

  const flag = v => v === true ? 'Yes' : v === false ? 'No' : 'N/A';

  return (
    <ScannerPage title="📧 Email Risk Checker">
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={handleCheck} className="scan-button">Check</button>
      </div>

      {loading && <p>Checking…</p>}
      {err && <div className="error-msg">{err}</div>}

      {data && (
        <div className="result-card">
          <h2>Verdict: {flag(data.valid)}</h2>
          <ul>
            <li><strong>SMTP Reachable:</strong> {flag(data.dns_valid)}</li>
            <li><strong>Disposable:</strong> {flag(data.disposable)}</li>
            <li><strong>DMARC:</strong> {flag(data.dmarc_record)}</li>
            <li><strong>Risk Score:</strong> {data.fraud_score}</li>
            <li><strong>Breached:</strong> {flag(data.leaked)}</li>
          </ul>
        </div>
      )}
    </ScannerPage>
  );
}
