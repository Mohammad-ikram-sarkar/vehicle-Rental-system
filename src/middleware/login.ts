import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../database/db";

const login = () => {
  return async (req: Request, res: Response, Next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(500).json({
        message: "you are not allowed !! jwt ",
      });
    }
    const decoded = jwt.verify(
      token,
      config.JWT_SECTET as string
    ) as JwtPayload;

    const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      decoded.email,
    ]);
    if (user.rows.length === 0) {
      throw new Error("user not found !");
    }

    req.user = decoded;
    Next();
  };
};

export default login;
