# Stock Lens

AI-powered stock analysis front end — HTML5, CSS3, Bootstrap 5, vanilla JavaScript. No backend; authentication is simulated with LocalStorage (registered users) and SessionStorage (active session).

## Open it

Just open `index.html` in a browser, or serve the folder with any static server (e.g. `python3 -m http.server`, or the VS Code "Live Server" extension). No build step, no npm install.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing page — logo, tagline, Sign In / Sign Up |
| `login.html` | Email + password login, with validation |
| `register.html` | Full name, phone, email, password + confirm, with validation |
| `dashboard.html` | Sticky navbar, search, feature cards, company research modal |

## Structure

```
stock-lens/
├── index.html / login.html / register.html / dashboard.html
├── css/style.css        ← design tokens + all component styles
├── js/
│   ├── data.js           ← company records (edit this to add companies)
│   ├── auth.js           ← register/login/logout/session guards
│   ├── ticker.js         ← renders the scrolling ticker-tape strip
│   └── dashboard.js      ← search, modal, download, toast logic
└── reports/              ← sample research PDFs (placeholders)
```

## Try it

1. Open `index.html` → Sign Up with any name/phone/email/password.
2. You'll be redirected to Sign In → log in with those same credentials.
3. On the dashboard, search one of: `TCS`, `Infosys`, `Reliance`, `HDFC Bank`, `Wipro`, `ICICI Bank` (or their tickers).
4. Click **Download Report** to grab the matching sample PDF.
5. Search anything else (e.g. `Apple`) to see the "not found" state.

## Adding a new company

Everything lives in one place — `js/data.js`:

```js
{
  ticker: "SBIN",
  name: "State Bank of India",
  sector: "Public Sector Banking",
  logoInitials: "SBI",
  logoColor: "#0E1C2E",
  description: "...",
  summary: "...",
  pdf: "reports/sbi.pdf",
  price: "820.10",
  change: "+0.5%",
  trend: "up",
}
```

Drop the matching PDF into `/reports`, and the search, modal, and download button all pick it up automatically — no other code changes needed.

## Notes on the sample PDFs

The six PDFs in `/reports` are placeholder research reports generated for this demo (see `generate_reports.py`) so the download flow works end-to-end. Swap in your real research PDFs at any time — just keep the file names matching `pdf` in `data.js`, or update the paths.

## Auth caveat

This uses LocalStorage/SessionStorage only, per the project's constraints — passwords are stored in plain text in the browser and this is **not** secure for real users or production data. It's a front-end demonstration of the auth flow, not a security-hardened system.
