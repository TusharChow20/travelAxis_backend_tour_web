import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OtpService } from "./otp.service";

const sendOtp = catchAsync(
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

    const result = await OtpService.sendOtp(email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
      data: null,
    });
  },
);

const verifyOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Email and OTP are required",
        data: null,
      });
    }

    const result = await OtpService.verifyOtp(email, otp);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
      data: null,
    });
  },
);

export const OtpController = {
  sendOtp,
  verifyOtp,
};
