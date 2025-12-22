import bcrypt from "bcryptjs";
import { pool } from "../../database/db";
import jwt from "jsonwebtoken";
import { config } from "../../config";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  if (typeof password !== "string" || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const heshpass = await bcrypt.hash(password as string, 10);
  console.log(heshpass);
  const result = await pool.query(
    `INSERT INTO Users (name , email, password,phone, role ) VALUES($1, $2, $3, $4,$5) RETURNING *`,
    [name, email, heshpass, phone, role]
  );
  return result;
};

const loginUser = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;
  
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    if (result.rows.length === 0) {
      return "User not created";
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password as string, user.password);
    if (!match) {
      return "User password not match";
    }

    const JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(JwtPayload, config.JWT_SECRET!, { expiresIn: "7d" });
      delete user.password;

    return { token, user };
 
};

export const authService = {
  createUser,
  loginUser,
};
