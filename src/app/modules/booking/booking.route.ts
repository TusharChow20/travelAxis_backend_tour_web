import express from "express";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { BookingController } from "./booking.controller";
import { validateUserRequest } from "../../middlewares/userValidateRequest";
import { createBookingZodValidation } from "./booking.validate";
const router = express.Router();
router.post(
  "/",
  checkAuthentication(...Object.values(Role)),

  validateUserRequest(createBookingZodValidation),
  BookingController.createBooking,
);
export const BookingRoutes = router;
