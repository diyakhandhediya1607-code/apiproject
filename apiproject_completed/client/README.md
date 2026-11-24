Admin Dashboard


A full-stack Admin Dashboard built with React, Vite,
Node.js, Express, and MongoDB.

Features
Admin registration and login
JWT-based authentication
Protected dashboard routes
Dashboard statistics
User management (Create, Read, Update, Delete)
Product management (Create, Read, Update, Delete)
MongoDB database integration
Dashboard interface
Tech Stack
Frontend: React, Vite, React Router, Axios, Lucide React, CSS
Backend: Node.js, Express.js, MongoDB, Mongoose, JSON Web Token
(JWT), bcryptjs, dotenv, cors

Project Structure
apiproject/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Users.jsx
│   │   │   └── Products.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── api.js
│   └── package.json
└── server/
    ├── models/
    │   ├── Admin.js
    │   ├── User.js
    │   └── Product.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── productRoutes.js
    │   └── dashboardRoutes.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── .env
    ├── server.js
    └── package.json
This is the structure discussed during development. Adjust filenames
or folders if your local project differs.

Requirements
Node.js (LTS recommended)
npm
MongoDB Community Server or MongoDB Atlas
Installation and Setup
1. Install backend dependencies
cd server
npm install
2. Configure environment variables
Create a .env file inside server/:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/admin_dashboard
JWT_SECRET=replace_this_with_a_long_random_secret
Use a strong private value for JWT_SECRET. Never publish your .env
file.

3. Start the backend
Run this command from the server/ folder:

npm run dev
The backend should run at http://localhost:5000.

4. Install frontend dependencies
Open a second terminal:

cd client
npm install
5. Start the frontend
Run from the client/ folder:

npm run dev
Open the local URL printed by Vite in your browser (commonly
http://localhost:5173).

API Routes
Method Route Purpose

POST /api/auth/register Register an admin
POST /api/auth/login Admin login
GET / POST /api/users List or create users
PUT / DELETE /api/users/:id Update or delete a user
GET / POST /api/products List or create products
PUT / DELETE /api/products/:id Update or delete a product
GET /api/dashboard Dashboard statistics

Protected endpoints require a valid JWT. Confirm exact methods and
response formats in your route files.

Testing Checklist
MongoDB is running and the backend connects.
The frontend opens in the browser.
Admin registration works, if enabled.
Admin login works with valid credentials.
Protected pages cannot be accessed without login.
Users can be added, viewed, edited, and deleted.
Products can be added, viewed, edited, and deleted.
Dashboard statistics load correctly.
Logout clears the session and returns to the login page.
Security Notes
Keep .env and the JWT secret private.
Do not publish real admin credentials.
If public admin registration is enabled, disable or restrict it
after creating the first admin.
Before production deployment, add suitable validation, rate
limiting, secure token handling, and authorization checks.
Do not commit node_modules/ or secret files to Git.
Author
Add your name here.

License
Add a license if you plan to distribute this project.
