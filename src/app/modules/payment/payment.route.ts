import express from "express";
import { PaymentController } from "./payment.controller";
const router = express.Router();

router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);
router.post("/initial-payment/:bookingId",PaymentController.initializePayment)
export const PaymentRoutes = router;
