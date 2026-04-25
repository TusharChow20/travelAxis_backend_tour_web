import express from "express";
import { PaymentController } from "./payment.controller";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);
router.post(
  "/initial-payment/:bookingId",
  checkAuthentication(...Object.values(Role)),
  PaymentController.initializePayment,
);
router.post(
  "/validate-payment",
  checkAuthentication(...Object.values(Role)),
  PaymentController.validatePayment,
);
router.get(
  "/booking/:bookingId",
  checkAuthentication(...Object.values(Role)),
  PaymentController.getPaymentByBooking,
);

export const PaymentRoutes = router;
