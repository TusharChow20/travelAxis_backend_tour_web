import express from "express";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { BookingController } from "./booking.controller";
import { validateUserRequest } from "../../middlewares/userValidateRequest";
import { createBookingZodValidation } from "./booking.validate";
import { Role } from "../user/user.interface";
const router = express.Router();
router.post(
  "/",
  checkAuthentication(...Object.values(Role)),

  validateUserRequest(createBookingZodValidation),
  BookingController.createBooking,
);

router.get(
  "/my-bookings",
  checkAuthentication(...Object.values(Role)),
  BookingController.getMyBookings,
);
router.get(
  "/all",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  BookingController.getAllBookings,
);

export const BookingRoutes = router;
