import express from "express";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { BookingController } from "./booking.controller";
const router = express.Router();
router.post(
  "/",
  checkAuthentication(...Object.values(Role)),
  BookingController.createBooking,
);
export const BookingRoutes = router;
