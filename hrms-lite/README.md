# HRMS Lite – Human Resource Management System

A lightweight, production-ready HR management system built with the MERN stack.

---

## 🚀 Live Demo

| Resource | URL |
|---|---|
| Frontend | _Deploy to Vercel_ |
| Backend API | _Deploy to Render_ |
| GitHub | _Your repo URL_ |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Deployment | Vercel (Frontend) · Render (Backend) |

---

## ✅ Features

### Employee Management
- Add employees with Employee ID, Full Name, Email, Department
- View all employees in a table
- Delete employee (also removes their attendance records)
- Client-side + server-side validation (duplicate ID/email, valid email format)

### Attendance Management
- Mark attendance (Present / Absent) per employee per date
- Upsert logic — re-marking updates the existing record
- View all records with filter by employee and/or date
- Shows total present days when filtering by employee

### Dashboard
- Total employees count
- Today's present / absent / not-marked counts
- Attendance summary table with total present days per employee

---

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Error handler
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   └── index.js        # Entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── pages/          # Dashboard, Employees, Attendance
    │   ├── services/       # Axios API calls
    │   ├── App.js          # Routing + layout
    │   ├── index.js
    │   └── index.css       # Global styles (white theme)
    └── package.json
```

---

## ⚙️ Running Locally

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/hrms-lite.git
cd hrms-lite
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set your MONGODB_URI
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
npm install
# If backend is NOT on localhost:5000, create a .env file:
# REACT_APP_API_URL=https://your-backend.onrender.com/api
npm start
# Runs on http://localhost:3000
```

---

## 🌐 Deployment

### Backend → Render
1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variable: `MONGODB_URI=mongodb+srv://...`

### Frontend → Vercel
1. Create a new project on [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `build`
5. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

---

## 📌 API Reference

### Employees
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | Get all employees |
| POST | `/api/employees` | Add new employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Attendance
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/attendance` | Get records (optional: `?employeeId=&date=`) |
| POST | `/api/attendance` | Mark/update attendance |
| GET | `/api/attendance/summary` | Dashboard summary |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | API health check |

---

## 📝 Assumptions & Limitations

- Single admin user — no authentication required (as per assignment spec)
- Leave management, payroll, and advanced HR features are out of scope
- Attendance is one record per employee per date (re-marking updates it)
- Dates stored as `YYYY-MM-DD` strings in MongoDB

---

## 👨‍💻 Author

Built as part of a Full-Stack Developer assignment.
