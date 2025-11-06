import API from "../api/axiosInstance";

export const getCart = () => API.get("/cart");

export const addToCart = (productId, quantity = 1) =>
  API.post(`/cart/add?productId=${productId}&quantity=${quantity}`);
export const removeFromCart = (productId) =>
  API.delete(`/cart/remove?productId=${productId}`);
export const clearCart = () => API.delete("/cart/clear");

export const updateQuantity = (productId, quantity) =>
  API.put(`/cart/update?productId=${productId}&quantity=${quantity}`);
