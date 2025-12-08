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
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password as string, user.password);
    if (!match) {
      return false;
    }

    const JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const secret = config.JWT_SECTET;
    const token = jwt.sign(JwtPayload, secret!, { expiresIn: "7d" });
    return { token, user };
  } catch (err: any) {
    return false;
  }
};

export const authService = {
  createUser,
  loginUser,
};
