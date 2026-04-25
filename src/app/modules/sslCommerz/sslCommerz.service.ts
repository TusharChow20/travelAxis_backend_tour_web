import axios from "axios";
import varEnv from "../../config/env";
import { ISSLCOMMERZ } from "./sslCommerz.interface";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";

const sslPaymentInitialize = async (payload: ISSLCOMMERZ) => {
  try {
    const data = {
      store_id: varEnv.SSL.SSL_STORE_ID,
      store_passwd: varEnv.SSL.SSL_STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${varEnv.SSL.SSL_SUCCESS_URL_BACKEND}?transactionId=${payload.transactionId}`,
      fail_url: `${varEnv.SSL.SSL_FAIL_URL_BACKEND}?transactionId=${payload.transactionId}`,
      cancel_url: `${varEnv.SSL.SSL_CANCEL_URL_BACKEND}?transactionId=${payload.transactionId}`,
      ipn_url: varEnv.SSL.SSL_IPN_URL,
      shipping_method: "N/A",
      product_name: "Travel",
      product_category: "Travel",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Chittagong",
      cus_state: "Chittagong",
      cus_postcode: "4000",
      cus_country: "BD",

      cus_phone: payload.phone,
      cus_fax: "33333333",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "N/A",
      ship_country: "N/A",
      multi_card_name: "N/A",
      value_a: "N/A",
      value_b: "N/A",
      value_c: "N/A",
      value_d: "N/A",
    };

    const response = await axios({
      method: "POST",
      url: varEnv.SSL.SSL_PAYMENT_API!,
      data: data,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Payment initialization failed");
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${varEnv.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${varEnv.SSL.SSL_STORE_ID}&store_passwd=${varEnv.SSL.SSL_STORE_PASS}&format=json`,
    });

    const validationData = response.data;

    if (
      validationData.status !== "VALID" &&
      validationData.status !== "VALIDATED"
    ) {
      throw new Error("Payment validation failed");
    }

    await Payment.findOneAndUpdate(
      { transactionId: payload.tran_id },
      {
        status: PAYMENT_STATUS.PAID,
        paymentGateWay: validationData,
      },
      { new: true },
    );

    return validationData;
  } catch (error) {
    console.log("Validation error:", error);
    throw new Error("Payment validation failed");
  }
};

export const SSLService = {
  sslPaymentInitialize,
  validatePayment,
};
