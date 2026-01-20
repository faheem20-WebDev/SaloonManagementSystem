# Luxe Saloon - Fullstack Management System

A modern, luxurious salon management system built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **PostgreSQL**.

## 🚀 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL (Managed via Neon DB & Sequelize ORM).
- **Security:** JWT Authentication, Helmet, Express Rate Limit, Bcrypt password hashing.
- **Deployment:** Vercel (Frontend), Hugging Face Spaces (Backend/Docker).

## ✨ Key Features

- **Intelligent Auto-Assignment:** System automatically assigns available stylists to bookings in real-time.
- **Dynamic Receipt Generation:** Automatic receipt generation with unique IDs and stylist details.
- **Receipt Download:** Option for customers to download their booking receipts as text/PDF.
- **Role-Based Dashboards:**
  - **Customer Portal:** Book appointments, view real-time history, and download receipts.
  - **Worker Portal:** View and manage personal task schedules.
  - **Admin Dashboard:** Full control over users, workers, services, and all salon bookings.
- **Security Hardened:** Protection against DDoS (Rate limiting) and common web vulnerabilities (Helmet).
- **Modern UI/UX:** Responsive design, Dark/Light mode support, and smooth luxury animations.

## 🛠️ Setup Instructions

### 1. Windows Quick Start (One-Click)

If you are on Windows, you can simply run the automated batch script to start both servers:
1. Double-click **`start-app.bat`** in the root directory.
2. This will launch the Backend (port 5000) and Frontend (port 5173) in separate command windows.

### 2. Backend Setup (Node.js & PostgreSQL)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in a `.env` file:
   ```env
   DATABASE_URL='your_postgresql_connection_string'
   JWT_SECRET='your_strong_secret_key'
   PORT=5000
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup (React & Vite)

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   - Create a `.env` file and set `VITE_API_URL=http://localhost:5000/api`
4. Start the app:
   ```bash
   npm run dev
   ```

## 🌍 Deployment

### Backend (Hugging Face Spaces)
The backend is Dockerized. Ensure the following secrets are set in your Space:
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT=7860`

### Frontend (Vercel)
Set the `VITE_API_URL` environment variable to your Hugging Face Space URL followed by `/api`.

## 📂 Folder Structure

- `frontend/`: React + Vite + Tailwind
- `backend/`: Node + Express + Sequelize
- `backend/models/`: PostgreSQL Models (User, Appointment, Service, Settings)
- `backend/controllers/`: Business logic & Auto-assignment rules
- `backend/routes/`: API endpoints
- `frontend/src/api/`: Axios configuration
- `frontend/src/context/`: Auth & Theme management
- `frontend/src/pages/dashboards/`: Multi-role dashboard views

## 📝 License
This project is for demo purposes. Build with luxury in mind.