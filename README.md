# ✦ Luxe Barber: Salon Booking Platform
 
A full-stack salon booking platform with **role-based dashboards** for customers, stylists, and admins. Customers book and pay online, stylists manage their appointments, and admins track revenue and run the business from one place.
 
🔗 **Live demo:** https://saloon-management-system-neon.vercel.app/
 
![Luxe Barber home page](screenshots/home.png)
 
---
 
## ✨ Features
 
### 👤 Customer
- Book a service by choosing a treatment, date, and time (bookings open up to 3 months ahead)
- Pay **online with Stripe** or choose **Pay at Salon**
- Instant booking confirmation with a unique appointment ID
- Appointment history with status for every booking
- Download a **PDF receipt** for each booking
- Cancel an appointment, with the refund policy shown before confirming
### ✂️ Stylist
- Personal portal showing assigned appointments
- Mark appointments as completed or cancelled
- Manage a public profile (display name, photo, and bio)
### 🛡️ Admin
- Revenue & analytics dashboard: today, this week, this month, and total year
- Top services chart and top loyal clients
- Manage bookings, stylists, customers, and services
### 🔐 General
- Secure login with **role-based access control (RBAC)**: each user is routed to the correct dashboard
- Dark and light themes
- Responsive, luxury-style UI
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js |
| Database | PostgreSQL |
| Payments | Stripe |
| Deployment | Vercel |
 
---
 
## 📸 Screenshots
 
| Sign In | Customer Booking |
|---|---|
| ![Sign in](screenshots/login.png) | ![Booking](screenshots/booking.png) |
 
| Stripe Checkout | Admin Analytics |
|---|---|
| ![Checkout](screenshots/checkout.png) | ![Admin](screenshots/admin.png) |
 
| Stylist Portal | Role-Based Access |
|---|---|
| ![Stylist](screenshots/stylist.png) | ![RBAC](screenshots/rbac.png) |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [PostgreSQL](https://www.postgresql.org/) (running locally or hosted)
- A [Stripe](https://stripe.com/) account (test mode keys are enough)
### 1. Clone the repository
```bash
git clone https://github.com/faheem20-WebDev/SaloonManagementSystem.git
cd SaloonManagementSystem
```
 
### 2. Install dependencies
```bash
# adjust the folder names to match your project
cd server && npm install
cd ../client && npm install
```
 
### 3. Set up environment variables
Create a `.env` file in the server folder (see `.env.example`):
 
```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/luxe_barber
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
```
 
And in the client folder:
 
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
```
 
> ⚠️ Never commit your real `.env` file or secret keys. Use Stripe **test** keys for development.
 
### 4. Set up the database
```bash
# adjust to your own setup (migration, schema file, or seed script)
psql -U postgres -d luxe_barber -f database/schema.sql
```
 
### 5. Run the app
```bash
# terminal 1: backend
cd server
npm run dev
 
# terminal 2: frontend
cd client
npm run dev
```
 
Open `http://localhost:5173` in your browser.
 
---
 
## 🔑 Demo Accounts
 
| Role | Email | Password |
|---|---|---|
| Customer | `client@mail.com` | `password123` |
| Stylist | `sammar@email.com` | `password123` |
| Admin | `admin@example.com` | `your_demo_password` |
 
> Payments run in **Stripe test mode**. Use the test card `4242 4242 4242 4242` with any future expiry date and any CVC.
 
---
 
## 📁 Project Structure
 
```
SaloonManagementSystem/
├── frontend/            # React frontend
├── backend/            # Node.js backend (API, auth, Stripe)
├── screenshots/            #Readme ScreenSpts


```
 
---
 
## 🔮 Roadmap
 
- [ ] Convert the platform into a **full CMS**, so the admin can upload and manage images of services and barbers from the dashboard
- [ ] Store uploaded images with **Cloudinary**
- [ ] Email / SMS booking reminders
- [ ] Reviews and ratings for stylists
---
 
## 👨‍💻 Author
 
**Muhammad Faheem Ahmed**
Software Engineering student and full-stack developer
 
- GitHub: [@faheem20-WebDev](https://github.com/faheem20-WebDev)
- LinkedIn: [Faheem Ahmed](https://www.linkedin.com/in/faheem-ahmed-b01428378/)
- portfolio: [Faheem Ahmed](https://faheem-portfolio-nine.vercel.app/)

---