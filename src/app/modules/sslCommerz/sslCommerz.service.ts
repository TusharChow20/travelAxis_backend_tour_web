import axios from "axios";
import varEnv from "../../config/env";
import { ISSLCOMMERZ } from "./sslCommerz.interface";

const sslPaymentInitialize = async (payload: ISSLCOMMERZ) => {
  try {
    const data = {
      store_id: varEnv.SSL.SSL_STORE_ID,

      store_passwd: varEnv.SSL.SSL_STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: varEnv.SSL.SSL_SUCCESS_URL_BACKEND,
      fail_url: varEnv.SSL.SSL_FAIL_URL_BACKEND,
      cancel_url: varEnv.SSL.SSL_CANCEL_URL_BACKEND,

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
      headers: { "content-type": "application/x-www-from-urlencoded" },
    });
    return response.data;
  } catch (error) {
    throw new Error("Payment failed");
    console.log(error);
  }
};
export const SSLService = {
  sslPaymentInitialize,
};
