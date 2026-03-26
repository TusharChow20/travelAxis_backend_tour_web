import { NextFunction, Request, Response } from "express";
import app from "../../app";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({
    success: false,
    message: `Getting error in global error ${err.message}`,
  });
};
