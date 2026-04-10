import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();
  const user = await User.findById(userId);
  const session = await Booking.startSession();

  try {
    session.startTransaction();

    if (!user?.phone || !user.address) {
      throw new Error("Need Phone Number & Address");
    }

    const tour = await Tour.findById(payload.tour)
      .select<{ costFrom: number }>("costFrom")
      .session(session);

    if (!tour) {
      throw new Error("Tour not found");
    }

    const amount = Number(tour.costFrom) * Number(payload.peopleCount);
    const [booking] = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session },
    );

    if (!booking) {
      throw new Error("Failed to create booking");
    }

    const [payment] = await Payment.create(
      [
        {
          bookingId: booking._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId,
          amount,
        },
      ],
      { session },
    );

    if (!payment) {
      throw new Error("Failed to create payment");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking._id,
      { payment: payment._id },
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    await session.commitTransaction();
    return updatedBooking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const BookingService = {
  createBooking,
};
