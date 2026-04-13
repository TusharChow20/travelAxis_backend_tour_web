import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import varEnv from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.successPayment(
    req.query as Record<string, string>,
  );
  if (result.success) {
    res.redirect(varEnv.SSL.SSL_SUCCESS_URL_FRONTEND as string);
  }
});
const failPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.failPayment(
    req.query as Record<string, string>,
  );
  if (!result.success) {
    res.redirect(varEnv.SSL.SSL_FAIL_URL_FRONTEND as string);
  }
});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.cancelPayment(
    req.query as Record<string, string>,
  );
  if (!result.success) {
    res.redirect(varEnv.SSL.SSL_CANCEL_URL_FRONTEND as string);
  }
});
const initializePayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const result = await PaymentService.initializePayment(bookingId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking payment successfully",
    data: result,
  });
});
export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,

  initializePayment,
};
