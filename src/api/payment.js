import API from "./axiosInstance"; // <-- your configured axios with interceptors

// 💳 Initiate a new payment (e.g. create Razorpay/Stripe order)
export const initiatePayment = (orderId, paymentData) => {
  return API.post(`/api/payments/initiate/${orderId}`, paymentData);
};

// ✅ Verify payment after user completes it
// Backend should validate signature or transaction ID
export const verifyPayment = (paymentId) => {
  return API.post(`/api/payments/verify/${paymentId}`);
};

// 🧾 Fetch payment history for the logged-in user
export const fetchPaymentHistory = () => {
  return API.get(`/api/payments/history`);
};
