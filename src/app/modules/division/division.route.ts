import { Router } from "express";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DivisionControllers } from "./division.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/create",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("thumbnail"),
  DivisionControllers.createDivision,
);

router.get("/", DivisionControllers.getAllDivisions);
router.patch(
  "/:id",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionControllers.updateDivision,
);
router.delete(
  "/:id",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionControllers.deleteDivision,
);

router.get("/:slug", DivisionControllers.getSingleDivision);

export const DivisionRoute = router;
