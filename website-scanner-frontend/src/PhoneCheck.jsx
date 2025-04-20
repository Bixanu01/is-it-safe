import React, { useState } from 'react';
import axios from 'axios';
import ScannerPage from './components/ScannerPage';

export default function PhoneCheck() {
  const codes = [{ code: '+1', name: 'US' }, { code: '+44', name: 'UK' }, /*…*/];
  const [cc, setCc] = useState(codes[0].code);
  const [num, setNum] = useState('');
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      const res = await axios.post('http://localhost:3001/check-phone', { phone: cc+num });
      setData(res.data);
    } catch {
      setErr('Lookup failed — verify the number.');
    }
    setLoading(false);
  };

  const flag = v => v === true ? 'Yes' : v === false ? 'No' : 'N/A';

  return (
    <ScannerPage title="📞 Phone Number Checker">
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <select value={cc} onChange={e => setCc(e.target.value)}>
          {codes.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
        <input
          type="text"
          placeholder="1234567890"
          value={num}
          onChange={e => setNum(e.target.value)}
        />
        <button onClick={handleCheck} className="scan-button">Check</button>
      </div>

      {loading && <p>Checking…</p>}
      {err && <div className="error-msg">{err}</div>}

      {data && (
        <div className="result-card">
          <h2>Status: {flag(data.valid)}</h2>
          <ul>
            <li><strong>Active:</strong> {flag(data.recently_active)}</li>
            <li><strong>Fraud Score:</strong> {data.fraud_score}</li>
            <li><strong>Carrier:</strong> {data.carrier}</li>
            <li><strong>Line Type:</strong> {data.line_type}</li>
          </ul>
        </div>
      )}
    </ScannerPage>
  );
}
