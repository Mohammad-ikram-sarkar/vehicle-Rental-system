import { Roles } from "../../config/rote";
import { pool } from "../../database/db";

const bookingPost = async (payload: Record<string, any>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const formatDate = (date: string | Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const vehicle = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status 
     FROM Vehicles 
     WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicle.rows.length === 0) throw new Error("Vehicle not found");

  const { vehicle_name, daily_rent_price, availability_status } =
    vehicle.rows[0];

  if (availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  const days =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (days <= 0) throw new Error("Invalid rental dates");

  const total_price = days * daily_rent_price;

  const result = await pool.query(
    `INSERT INTO Booking (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    booking: {
      ...result.rows[0],
      rent_start_date: formatDate(rent_start_date)!,
      rent_end_date: formatDate(rent_end_date),
      total_price: Number(total_price),
    },
    vehicle: {
      vehicle_name,
      daily_rent_price: Number(daily_rent_price),
    },
  };
};

const getBooking = async (userId: number, role: string) => {
  if (role === Roles.admin) {
    const result = await pool.query(`
      SELECT 
        b.id, 
        b.customer_id, 
        b.vehicle_id, 
        TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
        TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
        b.total_price, 
        b.status,
        u.name AS customer_name,
        u.email AS customer_email,
        v.vehicle_name,
        v.registration_number
      FROM Booking b
      JOIN Users u ON b.customer_id = u.id
      JOIN Vehicles v ON b.vehicle_id = v.id
    `);
    return result.rows;
  }

  const result = await pool.query(`
      SELECT 
        b.id,
        b.vehicle_id,
        TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
  TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
        b.total_price,
        b.status,
        v.vehicle_name,
        v.registration_number,
        v.type
      FROM Booking b
      JOIN Vehicles v ON b.vehicle_id = v.id
    `);
  return result.rows;
};

const updateBooking = async (bookingId: string, payload: any, user: any) => {
  const { status } = payload;

  // Check if booking exists
  const bookingRes = await pool.query(`SELECT * FROM Booking WHERE id = $1`, [
    bookingId,
  ]);
  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }
  const booking = bookingRes.rows[0];

  // Logic for returning a vehicle (Admin)
  if (status === "returned") {
    if (user.role !== "admin") {
      throw new Error("Only admin can mark bookings as returned");
    }

    const updateRes = await pool.query(
      `UPDATE Booking SET status = 'returned' WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    // Fetch vehicle for response
    const vehicleRes = await pool.query(
      `SELECT availability_status FROM Vehicles WHERE id = $1`,
      [booking.vehicle_id]
    );

    return {
      ...updateRes.rows[0],
      vehicle: vehicleRes.rows[0],
    };
  }

  // Logic for cancelling a booking (Customer)
  if (status === "cancelled") {
    // Check for customer ownership (using specific equality for potentially different types)
    if (
      user.role === "customer" &&
      Number(booking.customer_id) !== Number(user.id)
    ) {
      throw new Error("You are not authorized to cancel this booking");
    }

    if (user.role === "customer") {
      const startDate = new Date(booking.rent_start_date);
      const now = new Date();
      // Assuming strict time comparison.
      if (now.getTime() >= startDate.getTime()) {
        throw new Error("Cannot cancel booking after it has started");
      }
    }

    const updateRes = await pool.query(
      `UPDATE Bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    // If it was 'active', we should free up the vehicle.
    if (booking.status === "active") {
      await pool.query(
        `UPDATE Vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      );
    }

    return updateRes.rows[0];
  }

  throw new Error("Invalid status update");
};

export const bookingService = {
  bookingPost,
  getBooking,
  updateBooking,
};
