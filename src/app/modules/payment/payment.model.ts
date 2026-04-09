import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",

      required: true,

      unique: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentGateWay: {
      type: Schema.Types.Mixed,
    },
    invoiceURL: { type: String },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = model<IPayment>("Payment", paymentSchema);
