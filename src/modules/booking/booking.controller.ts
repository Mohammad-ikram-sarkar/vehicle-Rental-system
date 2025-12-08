import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { Roles } from "../../config/rote";

const bookingPost = async (req: Request, res: Response) => {
  try {
    const { booking, vehicle } = await bookingService.bookingPost(req.body);
    res.status(200).json({
      success: true,
      message: "Booking created successfully ",
      data: {
        ...booking,
        vehicle,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};
const getBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const rows = await bookingService.getBooking(user.id, user.role);

    const data =
      user.role === Roles.admin
        ? rows.map((row) => ({
            id: row.id,
            customer_id: row.customer_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            customer: {
              name: row.customer_name,
              email: row.customer_email,
            },
            vehicle: {
              vehicle_name: row.vehicle_name,
              registration_number: row.registration_number,
            },
          }))
        : rows.map((row) => ({
            id: row.id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            vehicle: {
              vehicle_name: row.vehicle_name,
              registration_number: row.registration_number,
              type: row.type,
            },
          }));

    const message =
      user.role === Roles.admin
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    res.status(200).json({ success: true, message, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const result = await bookingService.updateBooking(
      bookingId,
      req.body,
      req.user
    );

    const message =
      req.body.status === "returned"
        ? "Booking marked as returned. Vehicle is now available"
        : "Booking cancelled successfully";

    res.status(200).json({
      success: true,
      message,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

export default updateBooking;

export const bookingController = {
  bookingPost,
  getBooking,
  updateBooking,
};
