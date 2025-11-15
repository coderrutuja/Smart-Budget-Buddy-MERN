# Smart Budget Buddy (MERN)

A modern personal finance web app built with the MERN stack to help you track income and expenses, set budgets and goals, visualize trends, and receive actionable insights. It also includes gamification, in‑app notifications, and scaffolding for Google Sheets sync.

## Features

- Dashboard overview
  - Total balance, total income, total expense
  - Recent transactions
  - Category-wise spending pie (last 30 days)
  - Monthly income vs expense trend (last 6 months)
  - Insights panel (rule-based tips + simple expense forecast)
  - Achievements (badges) and logging streak
- Income tracking
  - Add, list, delete
  - Export to Excel
  - Export to Google Sheets (scaffolded)
- Expense tracking
  - Add, list, delete
  - Notes, tags, receipt upload (image)
  - Export to Excel
  - Export to Google Sheets (scaffolded)
- Budgets
  - Monthly/weekly/custom periods
  - Category or overall budgets
  - Utilization computation with thresholds
- Savings goals
  - Track target vs saved with progress
- Gamification
  - Under Budget, No Dining Out Week, Thrifty Week badges
  - Logging streak (consecutive days with activity)
- Notifications (in-app)
  - Budget threshold warnings
- Preferences & theme
  - Light/Dark theme toggle (persisted)
- PWA (planned)
  - Manifest + service worker (to be added)

## Tech Stack

- Frontend: React (Vite), React Router, Tailwind CSS, Recharts, axios, react-hot-toast
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, Multer, XLSX

## Monorepo Structure

```
smart-budget-buddy/
├─ backend/
│  ├─ config/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  └─ server.js
└─ frontend/smart-budget-buddy/
   ├─ public/
   └─ src/
```

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or hosted)

### 1) Backend setup

```
cd backend
cp .env.example .env  # if present; otherwise create .env as below
npm install
npm run dev
```

.env (example):
```
PORT=8000
MONGO_URL=mongodb://localhost:27017/smart-budget-buddy
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
# Optional (future Google Sheets integration)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GOOGLE_REDIRECT_URI=
# GOOGLE_SERVICE_ACCOUNT_JSON=
# GOOGLE_SHEET_ID=
```

### 2) Frontend setup

```
cd frontend/smart-budget-buddy
npm install
npm run dev
```

Frontend runs at http://localhost:5173 and proxies API calls to http://localhost:8000 (via axios baseURL).

## Scripts

- Backend
  - `npm run dev` – start dev server with nodemon
- Frontend
  - `npm run dev` – start Vite dev server

## API Overview (selected)

- Auth: `/api/auth/login`, `/api/auth/register`, `/api/auth/getUser`, `/api/auth/upload-image`
- Income: `POST /api/income/add`, `GET /api/income/get`, `DELETE /api/income/:id`, `GET /api/income/downloadexcel`
- Expense: `POST /api/expense/add`, `GET /api/expense/get`, `DELETE /api/expense/:id`, `GET /api/expense/downloadexcel`, `POST /api/expense/upload-receipt`
- Budgets: `POST/GET/PUT/DELETE /api/budgets`
- Goals: `POST/GET/PUT/DELETE /api/goals`
- Dashboard: `GET /api/dashboard`
- Insights: `GET /api/insights/category-summary`, `GET /api/insights/monthly-trend`, `GET /api/insights/tips`
- Gamification: `GET /api/gamification`
- Notifications: `GET /api/notifications`
- Sheets (scaffold): `POST /api/sheets/export/income`, `POST /api/sheets/export/expense`

## Google Sheets Export (Scaffold)

Export buttons are present on Income/Expense screens. Endpoints return **501 Not Implemented** until OAuth credentials are added.

TODO to enable:
1. Add the following to `backend/.env`:
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/api/sheets/oauth/callback
# OR service account:
# GOOGLE_SERVICE_ACCOUNT_JSON=<escaped JSON or path>
# GOOGLE_SHEET_ID=<target sheet>
```
2. Implement token exchange and use Google Sheets API to write data.

## Roadmap

- Receipts viewer (thumbnail + modal)
- Budget threshold and bill reminder notifications UI/UX polish
- Google Sheets full integration (OAuth)
- Preferences (currency, theme) persisted to user
- PWA: manifest + service worker + offline cache

## Contributing

PRs and issues are welcome.

## License

MIT
