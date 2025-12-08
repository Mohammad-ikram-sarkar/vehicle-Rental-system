# 🚗 Backend API – Express + PostgreSQL + JWT

A modular backend API built using **Node.js**, **Express**, **PostgreSQL**, and **JWT authentication**.  
The project uses a clean **module-based architecture** (Controller → Service → Route), making the code scalable and maintainable.

---

## 📁 Folder Structure

src/
│
├── config/
│ ├── index.ts
│ └── rote.ts
│
├── database/
│ └── db.ts
│
├── middleware/
│ ├── Admin.ts
│ └── login.ts
│
├── modules/
│ ├── auth/
│ │ ├── auth.controller.ts
│ │ ├── auth.route.ts
│ │ └── auth.service.ts
│ │
│ ├── booking/
│ │ ├── booking.controller.ts
│ │ ├── booking.route.ts
│ │ └── booking.service.ts
│ │
│ ├── user/
│ │ ├── user.controller.ts
│ │ ├── user.route.ts
│ │ └── user.service.ts
│ │
│ └── vehicles/
│ ├── vehicles.controller.ts
│ ├── vehicles.route.ts
│ └── vehicles.service.ts
│
├── types/
│
├── app.ts # Express app configuration
├── server.ts # Entry point to start the server

