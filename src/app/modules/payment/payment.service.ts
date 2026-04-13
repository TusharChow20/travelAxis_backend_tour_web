import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId } as any,

      {
        status: PAYMENT_STATUS.PAID,
      },

      { session },
    );
    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.bookingId,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment Done" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession(session);
    throw error;
  }
};
const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId } as any,

      {
        status: PAYMENT_STATUS.FAILED,
      },

      { session },
    );
    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.bookingId,
      { status: BOOKING_STATUS.FAILED },
      { new: true, runValidators: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Fail" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession(session);
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId } as any,

      {
        status: PAYMENT_STATUS.CANCELLED,
      },

      { session },
    );
    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.bookingId,
      { status: BOOKING_STATUS.CANCEL },
      { new: true, runValidators: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Canceled" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession(session);
    throw error;
  }
};
export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
};
