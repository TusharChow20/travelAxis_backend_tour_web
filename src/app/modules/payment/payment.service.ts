import { generateInvoicePDF } from "../../utils/generateInvoice";
import { sendMail } from "../../utils/seendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCOMMERZ } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import cloudinary from "../../config/cloudinary.config";

const uploadInvoiceToCloudinary = async (
  buffer: Buffer,
  transactionId: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "invoices",
        public_id: `invoice-${transactionId}`,
        resource_type: "raw",
        format: "pdf",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed"));

        const downloadUrl = result.secure_url.replace(
          "/upload/",
          "/upload/fl_attachment/",
        );
        resolve(downloadUrl);
      },
    );
    uploadStream.end(buffer);
  });
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId } as any,
      { status: PAYMENT_STATUS.PAID },
      { session, new: true },
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

    const user = updatedBooking?.user as any;
    const tour = updatedBooking?.tour as any;

    if (user && tour && updatedPayment) {
      const invoiceBuffer = await generateInvoicePDF({
        transactionId: updatedPayment.transactionId,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        tourTitle: tour.title,
        amount: updatedPayment.amount,
        paymentDate: new Date(),
        bookingId: updatedPayment.bookingId.toString(),
      });

      const invoiceURL = await uploadInvoiceToCloudinary(
        invoiceBuffer,
        updatedPayment.transactionId,
      );

      await Payment.findByIdAndUpdate(updatedPayment._id, { invoiceURL });

      await sendMail({
        to: user.email,
        subject: "Payment Successful - Your Invoice",
        template: "invoiceEmail",
        templateData: {
          userName: user.name,
          tourTitle: tour.title,
          amount: updatedPayment.amount,
          transactionId: updatedPayment.transactionId,
          invoiceURL,
        },
        attachments: [
          {
            filename: `invoice-${updatedPayment.transactionId}.pdf`,
            content: invoiceBuffer,
            contentType: "application/pdf",
          },
        ],
      });
    }

    return { success: true, message: "Payment Done" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId } as any,
      { status: PAYMENT_STATUS.FAILED },
      { session },
    );
    await Booking.findByIdAndUpdate(
      updatedPayment?.bookingId,
      { status: BOOKING_STATUS.FAILED },
      { new: true, runValidators: true, session },
    );
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Fail" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId } as any,
      { status: PAYMENT_STATUS.CANCELLED },
      { session },
    );
    await Booking.findByIdAndUpdate(
      updatedPayment?.bookingId,
      { status: BOOKING_STATUS.CANCEL },
      { new: true, runValidators: true, session },
    );
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Canceled" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const initializePayment = async (bookingId: string) => {
  const bookingPayment = await Payment.findOne({ bookingId });
  if (!bookingPayment) throw new Error("Booking does not exist");
  const booking = await Booking.findById(bookingId).populate(
    "user",
    "name email phone address",
  );
  if (!booking) throw new Error("Booking not found");

  const user = booking.user as any;

  const sslPayload: ISSLCOMMERZ = {
    name: user.name || "Customer",
    email: user.email,
    phone: user.phone || "01700000000",
    address: user.address || "Dhaka, BD",
    amount: bookingPayment.amount,
    transactionId: bookingPayment.transactionId,
  };

  const sslPayment = await SSLService.sslPaymentInitialize(sslPayload);
  return { paymentUrl: sslPayment.GatewayPageURL };
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initializePayment,
};
