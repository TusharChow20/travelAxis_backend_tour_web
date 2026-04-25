import { Router } from "express";
import { StatsController } from "./stats.controller";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

const adminAuth = checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN);

router.get("/bookings", adminAuth, StatsController.getBookingStats);
router.get("/payments", adminAuth, StatsController.getPaymentStats);
router.get("/users", adminAuth, StatsController.getUserStats);
router.get("/tours", adminAuth, StatsController.getTourStats);

export const StatsRoutes = router;
