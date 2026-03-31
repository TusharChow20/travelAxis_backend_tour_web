import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const loginCredentials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userLoginCredentials = await authServices.loginCredentials(req.body);
    res.cookie("refreshToken", userLoginCredentials.refreshToken, {
      httpOnly: true,
      secure: false,
    });
    res.cookie("accessToken", userLoginCredentials.accessToken, {
      httpOnly: true,
      secure: false,
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Login Successful",
      data: userLoginCredentials,
    });
  },
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await authServices.getNewAccessToken(refreshToken);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Login Successful",
      data: tokenInfo,
    });
  },
);

export const authControllers = {
  loginCredentials,
  getNewAccessToken,
};
