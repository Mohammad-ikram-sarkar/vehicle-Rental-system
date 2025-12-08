import { Router } from "express";
import { bookingController } from "./booking.controller";
import Admin from "../../middleware/Admin";
import { Roles } from "../../config/rote";

const router = Router();

router.post(
  "/",
  Admin(Roles.admin, Roles.customer),
  bookingController.bookingPost
);
router.get(
  "/",
  Admin(Roles.admin, Roles.customer),
  bookingController.getBooking
);
router.put(
  "/:id",
  Admin(Roles.admin, Roles.customer),
  bookingController.updateBooking
);

export const bookingRouter = router;
