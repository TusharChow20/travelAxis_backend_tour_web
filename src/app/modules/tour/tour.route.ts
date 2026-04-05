import { Router } from "express";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TourController } from "./tour.controller";

const router = Router();
router.post(
  "/create",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.createTour,
);

export const TourRoute = router;
