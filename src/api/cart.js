import API from "../api/axiosInstance";

//  Get the logged-in user's cart
export const getCart = () => API.get("/cart");

//  Add an item (uses query params)
export const addToCart = (productId, quantity = 1) =>
  API.post(`/cart/add?productId=${productId}&quantity=${quantity}`);

//  Remove a specific item
export const removeFromCart = (productId) =>
  API.delete(`/cart/remove?productId=${productId}`);

//  Clear the entire cart
export const clearCart = () => API.delete("/cart/clear");

//  (Optional) Update quantity (if you add this API in backend)
export const updateQuantity = (productId, quantity) =>
  API.put(`/cart/update?productId=${productId}&quantity=${quantity}`);
