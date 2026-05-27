import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCokkie";
import { userToken } from "../../utils/userToken";
import varEnv from "../../config/env";
import passport from "passport";
import { JwtPayload } from "jsonwebtoken";

const loginCredentials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) return next(error);
      if (!user) return next(new Error(info.message));

      const userTokens = userToken(user);
      const { password: pass, ...rest } = user.toObject();

      // set tokens as httpOnly cookies
      setAuthCookie(res, userTokens);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login Successful",
        data: {
          user: rest, // no tokens in body anymore
        },
      });
    })(req, res, next);
  },
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await authServices.getNewAccessToken(refreshToken);
    setAuthCookie(res, { accessToken: tokenInfo.accessToken });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "New token generated",
      data: null,
    });
  },
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await new Promise<void>((resolve) => {
        if (req.session) {
          req.session.destroy(() => resolve());
        } else {
          resolve();
        }
      });
    } catch (_) {}

    const isProduction = varEnv.NODE_ENV === "production";

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logout Successful",
      data: null,
    });
  },
);
const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user;
    if (!decodedToken)
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "User not authenticated",
        data: null,
      });

    await authServices.changePassword(oldPassword, newPassword, decodedToken);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  },
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user;
    if (!decodedToken)
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "User not authenticated",
        data: null,
      });

    await authServices.resetPassword(oldPassword, newPassword, decodedToken);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password reset successfully",
      data: null,
    });
  },
);

const googleCallBack = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user)
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "User not found",
        data: null,
      });

    const tokenInfo = userToken(user);
    setAuthCookie(res, tokenInfo);

    // ✅ Always redirect to auth-callback — it handles role-based routing
    res.redirect(`${varEnv.FRONTEND_URL as string}/auth-callback`);
  },
);

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const decodedToken = req.user as JwtPayload;
    if (!decodedToken)
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "User not authenticated",
        data: null,
      });
    if (!password)
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Password is required",
        data: null,
      });

    await authServices.setPassword(decodedToken.userId, password);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password set successfully",
      data: null,
    });
  },
);

const forgetPass = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Email is required",
        data: null,
      });
    }

    await authServices.forgetPassword(email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password reset email sent",
      data: null,
    });
  },
);

const resetPasswordWithToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Token and new password are required",
        data: null,
      });

    await authServices.resetPasswordWithToken(token, newPassword);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password reset successfully",
      data: null,
    });
  },
);

export const authControllers = {
  loginCredentials,
  getNewAccessToken,
  logout,
  changePassword,
  resetPassword,
  googleCallBack,
  setPassword,
  forgetPass,
  resetPasswordWithToken,
};
