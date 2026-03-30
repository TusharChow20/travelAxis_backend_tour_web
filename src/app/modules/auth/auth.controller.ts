import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const loginCredentials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userLoginCredentials = await authServices.loginCredentials(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Login Successful",
      data: userLoginCredentials,
    });
  },
);

export const authControllers = {
  loginCredentials,
};
