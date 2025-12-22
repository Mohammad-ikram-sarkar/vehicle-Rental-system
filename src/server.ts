// import express from "express";
// import { initDB } from "./database/db";
// import { authRouter } from "./modules/auth/auth.route";
// import { vehicles } from "./modules/vehicles/vehicles.route";
// import { userRouter } from "./modules/user/user.route";
// import { bookingRouter } from "./modules/booking/booking.route";

// const app = express();

// app.use(express.json());

// const port = 8000;

// initDB();

// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/vehicles", vehicles);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/bookings", bookingRouter);
import app from "./app";
import { config } from "./config";
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Example app on ${PORT}`);
});
