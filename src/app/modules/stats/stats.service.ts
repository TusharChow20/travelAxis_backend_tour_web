import { Payment } from "../payment/payment.model";
import { Booking } from "../booking/booking.model";
import { User } from "../user/user.model";
import { Tour } from "../tour/tour.model";
import { Division } from "../division/division.model";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Role } from "../user/user.interface";

// ── Booking Stats ──────────────────────────────────────
const getBookingStats = async () => {
  const [
    total,
    completed,
    failed,
    cancelled,
    pending,
    recentBookings,
    monthlyBookings,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: BOOKING_STATUS.COMPLETE }),
    Booking.countDocuments({ status: BOOKING_STATUS.FAILED }),
    Booking.countDocuments({ status: BOOKING_STATUS.CANCEL }),
    Booking.countDocuments({ status: BOOKING_STATUS.PENDING }),

    // Recent 5 bookings
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("tour", "title costFrom"),

    // Monthly bookings (last 6 months)
    Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]),
  ]);

  return {
    total,
    completed,
    failed,
    cancelled,
    pending,
    recentBookings,
    monthlyBookings,
  };
};

// ── Payment Stats ──────────────────────────────────────
const getPaymentStats = async () => {
  const [
    totalRevenue,
    paid,
    unpaid,
    failed,
    cancelled,
    refunded,
    recentPayments,
    monthlyRevenue,
  ] = await Promise.all([
    // Total revenue from paid payments
    Payment.aggregate([
      { $match: { status: PAYMENT_STATUS.PAID } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    Payment.countDocuments({ status: PAYMENT_STATUS.PAID }),
    Payment.countDocuments({ status: PAYMENT_STATUS.UNPAID }),
    Payment.countDocuments({ status: PAYMENT_STATUS.FAILED }),
    Payment.countDocuments({ status: PAYMENT_STATUS.CANCELLED }),
    Payment.countDocuments({ status: PAYMENT_STATUS.REFUNDED }),

    // Recent 5 payments
    Payment.find().sort({ createdAt: -1 }).limit(5).populate("bookingId"),

    // Monthly revenue (last 6 months)
    Payment.aggregate([
      { $match: { status: PAYMENT_STATUS.PAID } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]),
  ]);

  return {
    totalRevenue: totalRevenue[0]?.total ?? 0,
    counts: { paid, unpaid, failed, cancelled, refunded },
    recentPayments,
    monthlyRevenue,
  };
};

// ── User Stats ─────────────────────────────────────────
const getUserStats = async () => {
  const [
    totalUsers,
    totalGuides,
    totalAdmins,
    recentUsers,
    activeUsers,
    deletedUsers,
  ] = await Promise.all([
    User.countDocuments({ role: Role.USER, isDeleted: false }),
    User.countDocuments({ role: Role.GUIDE, isDeleted: false }),
    User.countDocuments({ role: Role.ADMIN, isDeleted: false }),

    // Recent 5 users
    User.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role isVerified createdAt"),

    User.countDocuments({ isActive: "ACTIVE", isDeleted: false }),
    User.countDocuments({ isDeleted: true }),
  ]);

  return {
    total: totalUsers + totalGuides + totalAdmins,
    breakdown: {
      users: totalUsers,
      guides: totalGuides,
      admins: totalAdmins,
    },
    activeUsers,
    deletedUsers,
    recentUsers,
  };
};

// ── Tour & Division Stats ──────────────────────────────
const getTourStats = async () => {
  const [totalTours, totalDivisions, recentTours, toursByDivision] =
    await Promise.all([
      Tour.countDocuments(),
      Division.countDocuments(),

      // Recent 5 tours
      Tour.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title costFrom slug division")
        .populate("division", "name"),

      // Tours grouped by division
      Tour.aggregate([
        {
          $group: {
            _id: "$division",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "divisions",
            localField: "_id",
            foreignField: "_id",
            as: "division",
          },
        },
        { $unwind: "$division" },
        {
          $project: {
            divisionName: "$division.name",
            count: 1,
          },
        },
      ]),
    ]);

  return {
    totalTours,
    totalDivisions,
    recentTours,
    toursByDivision,
  };
};

export const StatsService = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};
