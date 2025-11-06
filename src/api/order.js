import API from "./axiosInstance";

export const fetchUserOrders = (userId) => API.get(`/orders/customer/${userId}`);
export const createOrder = (data) => API.post("/orders", data);
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const cancelOrder = (orderId) => API.delete(`/orders/${orderId}`);
