# Luxe Saloon - Fullstack Management System

A modern, luxurious salon management system built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **Customer Portal:** Book appointments, view history, and manage profile.
- **Worker Portal:** View assigned tasks and update appointment status.
- **Admin Dashboard:** Manage users, workers, services, and view all bookings.
- **Security:** JWT Authentication, Bcrypt password hashing.
- **UI/UX:** Responsive design, Dark mode, Smooth animations.

## Prerequisites

- Node.js (v14+)
- MongoDB (Running locally or Atlas URI)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `backend` directory (or use the provided `.env`).
   - Ensure `MONGO_URI` is correct.
4. Seed the database with sample data:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### 2. Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Sample Credentials

- **Admin:** `admin@luxe.com` / `password123`
- **Worker:** `alice@luxe.com` / `password123`
- **Customer:** `jane@gmail.com` / `password123`

## Folder Structure

- `frontend/`: React + Vite + Tailwind
- `backend/`: Node + Express + Mongoose
- `backend/models/`: Database schemas
- `backend/controllers/`: API logic
- `backend/routes/`: API endpoints
- `frontend/src/context/`: Auth state management
- `frontend/src/pages/dashboards/`: Role-specific views
