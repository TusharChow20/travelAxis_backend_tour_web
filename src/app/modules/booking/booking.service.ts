import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  try {
    const user = await User.findById(userId);
    const tour = await Tour.findById(payload.tour).select("costFrom");
    const amount = Number(tour?.costFrom) * Number(payload.peopleCount);
    const booking = await Booking.create({
      user: userId,

      status: BOOKING_STATUS.PENDING,
      ...payload,
    });
  } catch (error) {
    console.log(error);
  }
};

export const BookingService = {
  createBooking,
};
