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
  try {
    const transactionId = getTransactionId();
    const user = await User.findById(userId);

    if (!user?.phone || !user.address) {
      throw new Error("Need Phone Number &&&& Address");
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");
    const amount = Number(tour?.costFrom) * Number(payload.peopleCount);
    const booking = await Booking.create({
      user: userId,

      status: BOOKING_STATUS.PENDING,
      ...payload,
    });

    const payment = await Payment.create({
      booking: booking._id,
      status: PAYMENT_STATUS.UNPAID,
      transactionId: transactionId,
      amount: amount,
    });
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking._id,
      { payment: payment._id },
      { new: true, runValidators: true },
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");
    return updatedBooking;
  } catch (error) {
    console.log(error);
  }
};

export const BookingService = {
  createBooking,
};
