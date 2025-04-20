import React, { useState } from 'react';
import axios from 'axios';
import ScannerPage from './components/ScannerPage';

export default function AppScan() {
  const [q, setQ] = useState('');
  const [andRes, setAndRes] = useState(null);
  const [iosRes, setIosRes] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setErr(null);
    setAndRes(null);
    setIosRes(null);
    try {
      const res = await axios.post('http://localhost:3001/scan-app', { query: q.trim() });
      setAndRes(res.data.android);
      setIosRes(res.data.ios);
      if (!res.data.android && !res.data.ios) setErr('Not found on either store.');
    } catch {
      setErr('Lookup failed — try again.');
    }
    setLoading(false);
  };

  const result = andRes || iosRes;
  const platform = andRes ? 'Android' : iosRes ? 'iOS' : null;

  return (
    <ScannerPage title="📱 Mobile App Scanner">
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="App name or ID"
          style={{ flexGrow: 1 }}
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button onClick={handleScan} className="scan-button">Scan</button>
      </div>

      {loading && <p>Scanning…</p>}
      {err && <div className="error-msg">{err}</div>}

      {result && (
        <div className="result-card">
          <h2>
            {result.title} <small>({platform})</small>
          </h2>
          <ul>
            <li><strong>Developer:</strong> {result.developer}</li>
            <li><strong>Rating:</strong> {result.rating}</li>
            {'installs' in result && <li><strong>Installs:</strong> {result.installs}</li>}
            {'size' in result && <li><strong>Size:</strong> {result.size}</li>}
            {result.updated && <li><strong>Updated:</strong> {result.updated}</li>}
          </ul>
        </div>
      )}
    </ScannerPage>
  );
}
