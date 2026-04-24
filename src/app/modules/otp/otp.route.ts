import { Router } from "express";
import { OtpController } from "./otp.controller";

const router = Router();

router.post("/send-otp", OtpController.sendOtp);
router.post("/verify-otp", OtpController.verifyOtp);

export const OtpRoutes = router;
