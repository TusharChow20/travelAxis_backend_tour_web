import { Router } from "express";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TourController } from "./tour.controller";
import { validateUserRequest } from "../../middlewares/userValidateRequest";
import {
  createTourDurationZodSchema,
  updateTourZodSchema,
} from "./tour.validate";

const router = Router();
router.post(
  "/create-tour",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.createTour,
);

router.patch(
  "/:id",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  validateUserRequest(updateTourZodSchema),
  TourController.updateTour,
);

export const TourRoute = router;
