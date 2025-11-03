// orderApi.js
import API from "./axiosInstance";

export const fetchUserOrders = (userId) => API.get(`/orders/customer/${userId}`);
export const createOrder = (data) => API.post("/orders", data);
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const cancelOrder = (orderId) => API.delete(`/orders/${orderId}`);

// Update order status (admin)
// export const updateOrderStatus = (orderId, status) =>
//   axios.put(`${API_URL}/orders/${orderId}`, { status }, { withCredentials: true });

