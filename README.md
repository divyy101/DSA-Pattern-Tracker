# DSA Pattern Tracker 🧠

A beginner-friendly MERN stack project to track and organize DSA problems by pattern.

## Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS + Axios
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose

## Folder Structure
```
Mern project/
├── client/        ← React Vite frontend
└── server/        ← Express + MongoDB backend
```

## Getting Started

### 1. Start the Backend Server

```bash
cd server
npm install
npm run dev
```

Server runs on: http://localhost:5000

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

> Make sure MongoDB is running locally on port 27017 before starting the server.

## API Endpoints

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | /problems          | Add a new problem    |
| GET    | /problems          | Get all problems     |
| PATCH  | /problems/:id      | Update a problem     |
| DELETE | /problems/:id      | Delete a problem     |

## Features
- ➕ Add DSA problems with pattern, difficulty, status, and notes
- 🔍 Search problems by name
- 📂 Filter by pattern
- ✏️ Edit problems inline
- 🗑️ Delete problems
- 📊 View total, solved, and unsolved count
