import API from "./axiosInstance";

export const initiatePayment = (orderId, paymentData) => {
  return API.post(`/api/payments/initiate/${orderId}`, paymentData);
};

export const verifyPayment = (paymentId) => {
  return API.post(`/api/payments/verify/${paymentId}`);
};

export const fetchPaymentHistory = () => {
  return API.get(`/api/payments/history`);
};
