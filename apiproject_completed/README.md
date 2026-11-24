# Admin Dashboard

A full-stack administrator dashboard built with React, Vite, Node.js, Express, and MongoDB.

## Features

- First-admin registration and admin login
- JWT-protected API and frontend routes
- Admin profile details and logout
- Dashboard statistics, inventory valuation, product category counts, and recent records
- User CRUD (create, list, update, delete), search, and status/role fields
- Product CRUD (create, list, update, delete), search, stock, category, price, and status fields
- Request validation, duplicate-email handling, centralized API errors, and health endpoint

## Tech stack

- **Frontend:** React, Vite, React Router, Axios, Lucide React
- **Backend:** Node.js, Express, Mongoose, MongoDB, JWT, bcryptjs

## Folder structure

```text
apiproject/
├── client/
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar, ProtectedRoute
│   │   ├── pages/            # Login, Dashboard, Users, Products, Settings
│   │   ├── api.js            # Axios instance and JWT interceptor
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── server/
│   ├── controllers/          # Auth, user, product, dashboard logic
│   ├── middleware/           # JWT authentication and error handling
│   ├── models/               # Admin, User, Product schemas
│   ├── routes/               # API route definitions
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── README.md
```

## Requirements

- Node.js (use a version supported by the Vite version in `client/package.json`)
- npm
- MongoDB Community Server running locally, or a MongoDB Atlas database

## Setup

### 1. Backend environment

Open a terminal in the project root and run:

```bash
cd server
```

Copy `.env.example` to `.env`, then set a private JWT secret. Example local configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/admin_dashboard
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_characters
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

Do not commit or share `.env`.

### 2. Install and run backend

From the `server` directory:

```bash
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default. Check `http://localhost:5000/api/health` for the server/database health response.

### 3. Install and run frontend

Open a second terminal from the project root:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL printed in the terminal (usually `http://localhost:5173`).

If the backend uses another URL, copy `client/.env.example` to `client/.env` and set `VITE_API_URL`.

## First admin account

Use the Register option on the login page to create the first administrator. For safety, the backend rejects further public registrations once an admin exists. Login with that account afterwards. If the database already contains an admin, do not expose a public registration endpoint; create any additional administrators through a separately secured admin-only workflow.

## API endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public, first admin only | Create first admin |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | JWT | Current admin profile |
| GET | `/api/health` | Public | API/database health |
| GET, POST | `/api/users` | JWT | List/create users |
| PUT, DELETE | `/api/users/:id` | JWT | Update/delete user |
| GET, POST | `/api/products` | JWT | List/create products |
| PUT, DELETE | `/api/products/:id` | JWT | Update/delete product |
| GET | `/api/dashboard/stats` | JWT | Dashboard statistics |

For protected endpoints, send `Authorization: Bearer <token>`.

## Testing checklist

- [ ] MongoDB is running and `/api/health` reports `database: connected`.
- [ ] First admin registration works; a second public registration is rejected.
- [ ] Admin login returns a token and opens the dashboard.
- [ ] Opening dashboard pages without a token redirects to login.
- [ ] User create, list, edit, delete, duplicate email, and search work.
- [ ] Product create, list, edit, delete, invalid price/stock, and search work.
- [ ] Dashboard statistics update after adding/removing users or products.
- [ ] Settings displays the current admin profile.
- [ ] Logout clears the session and returns to login.
- [ ] `npm run build` succeeds in the client folder.

## Security and production notes

This project is a development-ready baseline, not a production security audit. Before deployment, add rate limiting on authentication routes, stricter role-based permissions, HTTPS, secure cookie-based token storage or another reviewed token strategy, audit logging, and automated tests. Keep `.env` private and use a strong unique JWT secret. Never publish real credentials or database connection strings.

## Author

Add your name here.
