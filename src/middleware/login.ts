import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../database/db";

const login = () => {
  return async (req: Request, res: Response, Next: NextFunction) => {
    const authtoken = req.headers.authorization;
    if (!authtoken) {
      return res.status(401).json({ message: "You are not Authorized" });
    }

    const tokens = authtoken.split(" ");

    if (tokens.length !== 2 || tokens[0] !== "Bearer") {
      return res
        .status(401)
        .json({ message: "Invalid Authorization header format" });
    }
    const token = tokens[1]!;
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
