import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCokkie";

const loginCredentials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userLoginCredentials = await authServices.loginCredentials(req.body);
    setAuthCookie(res, userLoginCredentials);

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
    setAuthCookie(res, tokenInfo.accessToken);
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
