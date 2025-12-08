import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";

const Admin = (...roles: string[]) => {
  return async (req: Request, res: Response, Next: NextFunction) => {
    const authtoken = req.headers.authorization;

    if (!authtoken) {
      return res.status(401).json({ message: "You are not Authorized" });
    }

    //? extract token from Bearer <token>
    const tokens = authtoken.split(" ");

    //? check if token format is valid
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
    req.user = decoded;
    if (roles.length && !roles.includes(decoded.role)) {
      throw new Error("you are not authorized");
    }

    Next();
  };
};

export default Admin;
