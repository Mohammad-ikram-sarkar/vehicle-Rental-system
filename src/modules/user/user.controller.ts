import { Request, Response } from "express";
import { userService } from "./user.service";

const alluser = async (req: Request, res: Response) => {
  const result = await userService.alluser();
  const user = result.rows;
  result.rows.forEach((user) => {
    delete user.password;
  });

  res.status(200).json({
    success: true,
    message: "User retrieved successfully ",
    data: user,
  });
};
const OneUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const result = await userService.oneUpdate(id as string, payload);
    const user = result.rows[0];
    result.rows.forEach((user) => {
      delete user.password;
    });
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the user",
    });
  }
};
const DeleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const result = await userService.DeleteUser(id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const userController = {
  alluser,
  OneUpdate,
  DeleteUser,
};
