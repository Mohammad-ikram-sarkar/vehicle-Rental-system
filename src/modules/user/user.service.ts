import { pool } from "../../database/db";

const alluser = async () => {
  const result = await pool.query(`SELECT * FROM Users`);
  return result;
};
const oneUpdate = async (id: string, payload: Record<string, unknown>) => {
  const { name, email, phone, role } = payload;

  const result = await pool.query(
    `UPDATE Users 
     SET name = $1,
         email = $2,
         phone = $3,
         role = $4
     WHERE id = $5
     RETURNING *`,
    [name, email, phone, role, id]
  );

  return result;
};

const DeleteUser = async (id: string) => {
  await pool.query("DELETE FROM Users WHERE id = $1", [id]);

  return { success: true, message: "User deleted successfully" };
};

export const userService = {
  alluser,
  oneUpdate,
  DeleteUser,
};
