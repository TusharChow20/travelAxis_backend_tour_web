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
router.delete(
  "/:id",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTour,
);

router.get("/", TourController.getAllTours);
router.get("/suggestions", TourController.getTourSuggestions);
router.get("/", TourController.getAllTours);
router.get("/price-range", TourController.getPriceRange);
router.get("/:slug", TourController.getSingleTour);
export const TourRoute = router;
