import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import varEnv from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuthentication =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const verifyToken1 = verifyToken(
        token,
        varEnv.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;

      if (!roles.includes(verifyToken1.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden: Insufficient permissions",
        });
        return;
      }

      req.user = verifyToken1;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  };
