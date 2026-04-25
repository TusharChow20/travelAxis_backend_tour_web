import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import varEnv from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";

const successPayment = catchAsync(async (req: Request, res: Response) => {
  // SSLCommerz sends data in body, transactionId in query
  const data = {
    ...req.body,
    transactionId: req.query.transactionId as string,
  };
  const result = await PaymentService.successPayment(data);
  if (result.success) {
    res.redirect(varEnv.SSL.SSL_SUCCESS_URL_FRONTEND as string);
  }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const data = {
    ...req.body,
    transactionId: req.query.transactionId as string,
  };
  const result = await PaymentService.failPayment(data);
  if (!result.success) {
    res.redirect(varEnv.SSL.SSL_FAIL_URL_FRONTEND as string);
  }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const data = {
    ...req.body,
    transactionId: req.query.transactionId as string,
  };
  const result = await PaymentService.cancelPayment(data);
  if (!result.success) {
    res.redirect(varEnv.SSL.SSL_CANCEL_URL_FRONTEND as string);
  }
});

const initializePayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const result = await PaymentService.initializePayment(bookingId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment initialized successfully",
    data: result,
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.validatePayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment validated successfully",
    data: result,
  });
});

const getPaymentByBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getPaymentByBooking(req.params.bookingId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initializePayment,
  validatePayment,
  getPaymentByBooking,
};
