import { Router } from "express";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TourController } from "./tour.controller";
import { validateUserRequest } from "../../middlewares/userValidateRequest";
import { updateTourZodSchema } from "./tour.validate";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/create-tour",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  TourController.createTour,
);

router.patch(
  "/:id",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"), 
  validateUserRequest(updateTourZodSchema),
  TourController.updateTour,
);

router.get("/", TourController.getAllTours);

export const TourRoute = router;
