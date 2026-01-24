# Luxe Saloon - Fullstack Management System

A modern, luxurious salon management system built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **PostgreSQL**.

## 🚀 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Axios, Recharts (Analytics).
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL (Managed via Sequelize ORM).
- **Payments:** Stripe Integration (SCA Compliant).
- **Security:** JWT Authentication, Helmet, Express Rate Limit, Bcrypt hashing.

## ✨ Key Features

### 1. 📊 Advanced Analytics Dashboard
- **Real-time Revenue Charts:** Visualize daily, weekly, and monthly income using interactive bar charts.
- **Service Popularity:** Pie charts showing which treatments are most in-demand.
- **Loyal Clients:** Automatically identifies and displays top recurring customers.

### 2. 💳 Secure Stripe Payments
- **Integrated Checkout:** Customers can pay for services directly using Credit Cards, Apple Pay, or Google Pay.
- **Security:** Uses Stripe Payment Intents for bank-grade security and SCA compliance.
- **Refund System:** Admins can process refunds directly from the dashboard (with a 7-day policy).

### 3. 👥 Role-Based Portals
- **Customer Portal:** Book appointments, Pay online, View history.
- **Worker Portal:** View personal schedules and assigned tasks.
- **Admin Dashboard:** Full control over revenue, staff, services, and bookings.

### 4. 🤖 Automation
- **Auto-Assignment:** System intelligently assigns available stylists to bookings.
- **Receipts:** Automatic digital receipt generation for every transaction.

## 🛠️ Setup Instructions

### 1. Windows Quick Start (One-Click)
Double-click **`start-app.bat`** in the root directory. This launches both Frontend and Backend servers automatically.

### 2. Manual Setup

**Backend:**
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your Database/Stripe keys.
4. `npm run dev` (Runs on Port 5000)

**Frontend:**
1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env` and add your Stripe Public Key.
4. `npm run dev` (Runs on Port 5173)

### 3. Default Login Credentials
See **`CREDENTIALS.txt`** in the root folder for a list of Admin, Stylist, and Customer accounts.

## 🌍 Deployment
- **Frontend:** Vercel (Recommended)
- **Backend:** Render / Railway / Heroku
- **Database:** NeonDB / Supabase

## 📂 Project Structure
- `frontend/src/pages/dashboards/`: Contains the Revenue & Analytics logic.
- `backend/controllers/paymentController.js`: Handles Stripe transactions.
- `backend/models/`: Database schemas.

## 📝 License
Built for portfolio demonstration.
