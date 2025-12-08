import { Pool } from "pg";
import { config } from "../config";

export const pool = new Pool({
  connectionString: `${config.CONNECTION_STRING}`,
});

export const initDB = async () => {
  await pool.query(`
CREATE TABLE IF NOT EXISTS Users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    role VARCHAR(50) NOT NULL
);
`);

  await pool.query(`
CREATE TABLE IF NOT EXISTS Vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
    availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
);
`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Booking(
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES Users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES Vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,
    total_price NUMERIC,
    status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'retuned'))
);
`);
};
