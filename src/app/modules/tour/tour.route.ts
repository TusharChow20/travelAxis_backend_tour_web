import { Router } from "express";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TourController } from "./tour.controller";
import { validateUserRequest } from "../../middlewares/userValidateRequest";
import { updateTourZodSchema } from "./tour.validate";
import { multerUpload } from "../../config/multer.config";

const router = Router();

// POST
router.post(
  "/create-tour",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  TourController.createTour,
);

// PATCH
router.patch(
  "/:id",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateUserRequest(updateTourZodSchema),
  TourController.updateTour,
);

// DELETE
router.delete(
  "/:id",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTour,
);

// GET — specific routes MUST come before /:slug
router.get("/price-range", TourController.getPriceRange);
router.get("/suggestions", TourController.getTourSuggestions);
router.get("/", TourController.getAllTours);
router.get("/:slug", TourController.getSingleTour); // ← always last
export const TourRoute = router;
