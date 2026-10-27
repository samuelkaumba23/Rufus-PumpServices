# Rufus Pump Service

Official website for **Rufus Pump Service** – Licensed pump technicians in Lusaka, Zambia.

| Detail | Value |
|--------|-------|
| **Licence** | ZA537 |
| **Phones** | 0979 473 294 / 0767 468 267 |
| **Email** | samuelkaumba23@gmail.com |
| **Location** | Lusaka |

---

## Files in this project

```
rufus-pump-service/
├── index.html      ← Main website (all pages in one file)
├── js/
│   └── main.js     ← Invoice generator + forms
├── server.js       ← Simple Node server (for local or Render web service)
├── package.json    ← Project info + start script
├── .gitignore
├── render.yaml     ← Optional Render static config
└── README.md
```

---

## How to run the site

### Option 1 – Just open in browser (easiest)
Double-click `index.html` or open it in Chrome/Firefox.  
No install needed.

### Option 2 – Run with Node (recommended for testing)

```bash
node server.js
```

Then open: **http://localhost:3000**

Or:

```bash
npm start
```

### Option 3 – Deploy to Render (live website)

**A. Static Site (simplest – recommended)**

1. Push this folder to GitHub
2. On https://render.com → New + → Static Site
3. Connect the repo
4. Settings:
   - Build Command: (leave empty)
   - Publish Directory: .
5. Create → you get a live link

**B. Web Service (uses server.js)**

1. Push to GitHub
2. On Render → New + → Web Service
3. Connect the repo
4. Settings:
   - Runtime: Node
   - Build Command: (leave empty)
   - Start Command: node server.js
5. Create

---

## GitHub push commands

```bash
git init
git add .
git commit -m "Rufus Pump Service website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rufus-pump-service.git
git push -u origin main
```

Replace YOUR_USERNAME with your real GitHub username.

---

© 2026 Rufus Pump Service • Lusaka • Licence ZA537
