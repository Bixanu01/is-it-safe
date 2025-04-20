# Is It Safe

> A simple tool to scan websites, email addresses, phone numbers, and mobile apps for potential malicious or risky behavior.

---

## 🔍 Features

- **Website Scanner**: Checks URL reputation, risk score, phishing/malware flags, domain age.
- **Email Risk Checker**: Validates format, SMTP reachability, disposable provider, DMARC/SPF records, fraud score, breach presence.
- **Phone Number Checker**: Validates phone format, active status, fraud score, carrier & line type.
- **Mobile App Scanner**: Real‑time lookup from Google Play & App Store, tracks permissions, privacy risk badge, ratings & installs.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16
- npm (or Yarn)
- An [IPQualityScore](https://www.ipqualityscore.com/) API Key
- (Optional) SSH or HTTPS setup for GitHub

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/Bixanu01/is-it-safe.git
   cd is-it-safe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```ini
   IPQS_API_KEY=your_ipqualityscore_api_key
   ```

4. **Run backend**
   ```bash
   npm run start:server
   ```

5. **Run frontend** (in a separate terminal)
   ```bash
   cd website-scanner-frontend
   npm install
   npm start
   ```

6. **Open** your browser at `http://localhost:3000` (or whichever port React serves).

---

## 📦 Project Structure

```
/is-it-safe          # root
├── index.js         # Express backend
├── website-scanner-frontend/  # React frontend app
│   ├── src/
│   │   ├── components/ScannerPage.jsx
│   │   ├── App.jsx
│   │   ├── WebsiteScan.jsx
│   │   ├── EmailCheck.jsx
│   │   ├── PhoneCheck.jsx
│   │   └── AppScan.jsx
│   └── public/
├── .env.example     # example environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🛡️ Security & Best Practices

- **Never commit your real `.env`** file—use `.env.example` to show variable names.
- **Rotate** your IPQS API key if accidentally pushed.
- Use **Git branches** and **pull requests** to manage changes.
- Set up **CI** to run linting/tests on every PR.

---

## 🤝 Contributing

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m "feat: add X feature"`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

MIT © [Your Name]

