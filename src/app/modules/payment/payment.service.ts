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
  } catch (error) {}
};
const failPayment = async () => {};
const cancelPayment = async () => {};
export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
};
