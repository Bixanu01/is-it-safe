import React, { useState } from 'react';
import axios from 'axios';
import ScannerPage from './components/ScannerPage';

export default function WebsiteScan() {
  const [url, setUrl] = useState('');
  const [crawl, setCrawl] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      const res = await axios.post('http://localhost:3001/scan', { url, crawl });
      setData(res.data);
    } catch {
      setErr('Scan failed — please check the URL.');
    }
    setLoading(false);
  };

  return (
    <ScannerPage title="🌐 Website Scanner">
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <label style={{ margin: '0 1rem' }}>
          <input
            type="checkbox"
            checked={crawl}
            onChange={e => setCrawl(e.target.checked)}
          /> Crawl pages
        </label>
        <button onClick={handleScan} className="scan-button">Scan</button>
      </div>

      {loading && <p>Scanning…</p>}
      {err && <div className="error-msg">{err}</div>}

      {data && (
        <div className="result-card">
          <h2>
            {data.unsafe ? '⚠️ Unsafe!' : '✅ Safe'}
            <span style={{ float: 'right' }}>Score: {data.fraud_score ?? data.risk_score}</span>
          </h2>
          <ul>
            <li><strong>Domain Age:</strong> {data.domain_age?.human || 'Unknown'}</li>
            <li><strong>Phishing:</strong> {data.phishing ? 'Yes' : 'No'}</li>
            <li><strong>Malware:</strong> {data.malware ? 'Yes' : 'No'}</li>
            <li><strong>DNS Valid:</strong> {data.dns_valid ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      )}
    </ScannerPage>
);
}
