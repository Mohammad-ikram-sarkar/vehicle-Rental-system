import { Request, Response } from "express";
import { vahicleService } from "./vehicles.service";

const vahiclesPost = async (req: Request, res: Response) => {
  try {
    const result = await vahicleService.vehiclePost(req.body);
    res.status(200).json({
      success: true,
      message: "vehicle created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};

const allvehicles = async (req: Request, res: Response) => {
  try {
    const result = await vahicleService.allvehicles();

    res.status(200).json({
      success: true,
      message: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};

const onevehicles = async (req: Request, res: Response) => {
  try {
    const result = await vahicleService.onevehicles(req.params.id as string);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "vehicle retrieved successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const updatevehicles = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await vahicleService.updatevehicles(id!, req.body);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "vchicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "vehicle updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deletevehicles = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const result = await vahicleService.deletevehicle(id);

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
export const vahiclesController = {
  vahiclesPost,
  allvehicles,
  onevehicles,
  updatevehicles,
  deletevehicles,
};
