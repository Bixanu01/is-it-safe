require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const rawGplay = require('google-play-scraper');
const gplay = rawGplay.default || rawGplay;

const app = express();
const PORT = process.env.PORT || 3001;
const IPQS_KEY = process.env.IPQS_API_KEY;
if (!IPQS_KEY) throw new Error('Set IPQS_API_KEY in your .env');

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.send('OK'));

// 1) Website Scanner (IPQS URL Reputation)
app.post('/scan', async (req, res) => {
  const { url, crawl } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  const key = `url:${url}:${crawl}`;
  if (cache.has(key)) return res.json(cache.get(key));

  try {
    const api = `https://ipqualityscore.com/api/json/url/${IPQS_KEY}/${encodeURIComponent(url)}`;
    const resp = await axios.get(api, {
      params: { strictness: 1, full_data: true, allow_disposable: true, crawl }
    });
    cache.set(key, resp.data);
    res.json(resp.data);
  } catch (e) {
    console.error('[SCAN] IPQS URL error:', e.message);
    res.status(500).json({ error: 'Website scan failed', details: e.message });
  }
});

// 2) Email Checker (IPQS Email)
app.post('/check-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const key = `email:${email}`;
  if (cache.has(key)) return res.json(cache.get(key));

  try {
    const api = `https://ipqualityscore.com/api/json/email/${IPQS_KEY}/${encodeURIComponent(email)}`;
    const resp = await axios.get(api, { params: { strictness: 1, full_data: true } });
    cache.set(key, resp.data);
    res.json(resp.data);
  } catch (e) {
    console.error('[CHECK-EMAIL] IPQS error:', e.message);
    res.status(500).json({ error: 'Email check failed', details: e.message });
  }
});

// 3) Phone Checker (IPQS Phone)
app.post('/check-phone', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Missing phone' });

  const key = `phone:${phone}`;
  if (cache.has(key)) return res.json(cache.get(key));

  try {
    const api = `https://ipqualityscore.com/api/json/phone/${IPQS_KEY}/${encodeURIComponent(phone)}`;
    const resp = await axios.get(api, { params: { strictness: 1, full_data: true } });
    cache.set(key, resp.data);
    res.json(resp.data);
  } catch (e) {
    console.error('[CHECK-PHONE] IPQS error:', e.message);
    res.status(500).json({ error: 'Phone check failed', details: e.message });
  }
});

// 4) Mobile App Scanner (Play + App Store search & lookup)
app.post('/scan-app', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  let playId = null, iosId = null;
  const lower = query.toLowerCase();

  // Direct ID handling
  if (lower.startsWith('com.')) playId = lower;
  if (/^id\d+$/.test(query)) iosId = query;

  // Play Store search
  if (!playId) {
    try {
      const results = await gplay.search({ term: query, num: 1, country: 'us', lang: 'en' });
      if (results.length) playId = results[0].appId;
    } catch (e) {
      console.warn('[SCAN-APP] Play search error:', e.message);
    }
  }

  // iTunes search
  if (!iosId) {
    try {
      const lookup = await axios.get('https://itunes.apple.com/search', {
        params: { term: query, entity: 'software', limit: 1, country: 'us' }
      });
      if (lookup.data.results.length) iosId = `id${lookup.data.results[0].trackId}`;
    } catch (e) {
      console.warn('[SCAN-APP] iTunes search error:', e.message);
    }
  }

  // Lookup & return both
  const [android, ios] = await Promise.all([
    playId ? (async () => {
      try {
        const info = await gplay.app({ appId: playId, country: 'us', lang: 'en' });
        const perms = await gplay.permissions({ appId: playId, country: 'us', lang: 'en' });
        return { title: info.title, developer: info.developer, rating: info.score, installs: info.installs, updated: info.updated, permissions: perms };
      } catch { return null; }
    })() : Promise.resolve(null),
    iosId ? (async () => {
      try {
        const lookup = await axios.get('https://itunes.apple.com/lookup', { params: { id: iosId.replace(/^id/, ''), country: 'us' } });
        const d = lookup.data.results[0];
        if (!d) return null;
        return { title: d.trackName, developer: d.sellerName, rating: d.averageUserRating, size: d.fileSizeBytes, updated: d.currentVersionReleaseDate, permissions: [] };
      } catch { return null; }
    })() : Promise.resolve(null)
  ]);

  res.json({ android, ios });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
