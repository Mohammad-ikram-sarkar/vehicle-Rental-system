import { Request, Response } from "express";
import { authService } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUser(req.body);
    const user = result.rows[0];
    delete user.password;

    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
   
     
    return res.status(201).json({
      success: true,
      message: "Login successfull",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  createUser,
  loginUser,
};
