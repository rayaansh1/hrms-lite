* HRMS Lite

Built this for a full-stack assignment. It's a basic HR admin panel — you can add
employees, mark their attendance daily, and get a quick overview on the dashboard.

Kept it simple and focused on what was actually asked. No extra features, no
over-engineering.



* Tech Stack

- React, React Router, Axios — frontend
- Node.js, Express — backend
- MongoDB, Mongoose — database
- Vercel + Render — deployment

---

 * Running it locally

Need Node.js and MongoDB on your machine before starting.

Clone it

git clone https://github.com/rayaansh1/hrms-lite.git
cd hrms-lite

Backend

cd backend
npm install
cp .env.example .env
add your MongoDB URI in the .env file
npm run dev
runs on localhost:5000

Frontend

cd frontend
npm install
npm start
runs on localhost:3000

If using a live backend, add this to frontend/.env

REACT_APP_API_URL=https://your-backend-url/api


* A few things to note

- No authentication — single admin, as per the assignment
- Edit employee wasn't in the requirements so I didn't build it
- Marking attendance twice on the same date just updates the record
- Free Render tier can be slow on the first load, give it a few seconds
