# 🚗 Backend API – Express + PostgreSQL + JWT

A modular backend API built using **Node.js**, **Express**, **PostgreSQL**, and **JWT authentication**.  
The project uses a clean **module-based architecture** (Controller → Service → Route), making the code scalable and maintainable.

---
Link : https://vehicle-rental-system-pi-three.vercel.app

## 📁 Folder Structure

# Project Name
Your project description goes here. Briefly explain what your project does.

## Project Structure
```text
src/
├── config/
├── index.ts
├── rote.ts
├── database/
│   └── db.ts
├── middleware/
│   ├── Admin.ts
│   └── login.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.route.ts
│   │   └── auth.service.ts
│   ├── booking/
│   │   ├── booking.controller.ts
│   │   ├── booking.route.ts
│   │   └── booking.service.ts
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.route.ts
│   │   └── user.service.ts
│   └── vehicles/
│       ├── vehicles.controller.ts
│       ├── vehicles.route.ts
│       └── vehicles.service.ts
├── types/
├── app.ts         # Express app configuration
└── server.ts      # Entry point to start the server

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **PostgreSQL**
- **TypeScript**
- **JWT Authentication**
- **Layered architecture (Route → Controller → Service)**

---

## 🚀 Features

### 🔐 Auth Module
- Login with JWT
- Admin login
- Secure token generation

### 👤 User Module
- Register user
- Get user by ID
- Update user details

### 🚗 Vehicles Module
- Add vehicle
- Update vehicle info
- List all vehicles

### 📅 Booking Module
- Create booking
- Retrieve booking details
- Admin view of all bookings

### ⚙️ Middleware
- `login.ts` → Verifies JWT tokens  
- `Admin.ts` → Restricts admin-only routes  

---

## 📦 Installation

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd <project-folder>
