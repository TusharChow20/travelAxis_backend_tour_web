import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import varEnv from "../../config/env";

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.successPayment(
    req.query as Record<string, string>,
  );
  if (result.success) {
    res.redirect(varEnv.SSL.SSL_SUCCESS_URL_FRONTEND as string);
  }
});
const failPayment = catchAsync(async (req: Request, res: Response) => {});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {});
export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
};
