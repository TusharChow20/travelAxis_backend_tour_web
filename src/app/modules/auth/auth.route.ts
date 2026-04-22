import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { Role } from "../user/user.interface";
import { checkAuthentication } from "../../middlewares/checkAuth";
import passport from "passport";

const router = Router();

router.post("/login", authControllers.loginCredentials);
router.post("/refresh-token", authControllers.getNewAccessToken);
router.post("/logout", authControllers.logout);
router.post("/logout", authControllers.logout);
router.get("/forget-password", authControllers.forgetPass);
router.post(
  "/change-password",
  checkAuthentication(...Object.values(Role)),
  authControllers.changePassword,
);
router.post(
  "/reset-password",
  checkAuthentication(...Object.values(Role)),
  authControllers.resetPassword,
);
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  },
);
router.post(
  "/set-password",
  checkAuthentication(...Object.values(Role)),
  authControllers.setPassword,
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "login" }),
  authControllers.googleCallBack,
);

export const AuthRoutes = router;
