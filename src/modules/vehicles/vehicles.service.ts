import { pool } from "../../database/db";

const vehiclePost = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO Vehicles 
      (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0]; // usually want the inserted row, not whole result
};

const allvehicles = async () => {
  const result = await pool.query(`SELECT * FROM Vehicles`);
  return result;
};

const onevehicles = async (id: string) => {
  const result = await pool.query(`SELECT * FROM Vehicles WHERE id = $1`, [id]);
  return result;
};

const updatevehicles = async (id: string, payload: Record<string, unknown>) => {
  const { vehicle_name, type, registration_number, availability_status } =
    payload;

  const result = await pool.query(
    `UPDATE Vehicles 
     SET vehicle_name = $1,
         type = $2,
         registration_number = $3,
         availability_status = $4
     WHERE id = $5
     RETURNING *`,
    [vehicle_name, type, registration_number, availability_status, id]
  );

  return result;
};

const deletevehicle = async (id: string) => {
  const check = await pool.query(
    "SELECT availability_status FROM Vehicles WHERE id = $1",
    [id]
  );
  if (check.rowCount === 0) {
    return { success: false, message: "Vehicle not found" };
  }

  if (check.rows[0].availability_status === "booked") {
    return {
      success: false,
      message: "Cannot delete: vehicle is currently booked",
    };
  }

  await pool.query("DELETE FROM Vehicles WHERE id = $1", [id]);

  return { success: true, message: "Vehicle deleted successfully" };
};

export const vahicleService = {
  vehiclePost,
  allvehicles,
  onevehicles,
  updatevehicles,
  deletevehicle,
};
