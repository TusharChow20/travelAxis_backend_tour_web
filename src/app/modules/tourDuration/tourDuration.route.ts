import { Router } from "express";
import { TourDurationController } from "./tourDuration.controller";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.get("/", TourDurationController.getAllTourDurations);
router.post(
  "/",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  TourDurationController.createTourDuration,
);
router.delete(
  "/:id",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  TourDurationController.deleteTourDuration,
);

export const TourDurationRoutes = router;
