import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCokkie";
import { userToken } from "../../utils/userToken";
import varEnv from "../../config/env";

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
      message: "new token Successful",
      data: tokenInfo,
    });
  },
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,

      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,

      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "logout Successful",
      data: null,
    });
  },
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const getNewPassword = req.body.newPassword;

    const decodedToken = req.user;
    if (!decodedToken) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "User not authenticated",
        data: null,
      });
    }
    await authServices.resetPassword(oldPassword, getNewPassword, decodedToken);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Password changed Successful",
      data: null,
    });
  },
);
const googleCallBack = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let state = req.query.state ? (req.query.state as string) : "";

    if (state.startsWith("/")) {
      state = state.slice(1);
    }
    if (!user) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "User not found",
        data: null,
      });
    }

    const tokenInfo = userToken(user);
    setAuthCookie(res, tokenInfo);
    res.redirect(`${varEnv.FRONTEND_URL as string}/${state}`);
  },
);

export const authControllers = {
  loginCredentials,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallBack,
};
