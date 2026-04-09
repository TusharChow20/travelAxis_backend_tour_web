import { Types } from "mongoose";
export enum PAYMENT_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",

  REFUNDED = "REFUNDED",
}
export interface Payment {
  bookingId: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGateWay?: any; //type not fixed
  invoiceURL?: string;
  status: PAYMENT_STATUS;
}
