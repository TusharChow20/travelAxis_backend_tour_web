import { Router } from "express";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DivisionControllers } from "./division.controller";

const router = Router();

router.post(
  "/create",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionControllers.createDivision,
);

router.get("/", DivisionControllers.getAllDivisions);

export const DivisionRoute = router;
