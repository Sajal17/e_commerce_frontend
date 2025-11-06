import API from "./axiosInstance";

export const getOwnSellerProfile = () => API.get(`/seller/profile`);
export const updateSellerProfile = (data) => API.put(`/seller/profile`, data);
export const deleteSellerProfile = () => API.delete(`/seller/profile`);

export const getSellerProducts = () => API.get(`/seller/products`);
export const getSingleProduct = (productId) => API.get(`/seller/products/${productId}`);

export const addProduct = (data) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const sellerId = user?.id;
  return API.post(`/seller/products?sellerId=${sellerId}`, data); // Axios handles multipart
};

export const updateProduct = (productId, data) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const sellerId = user?.id;
  return API.put(`/seller/products/${productId}?sellerId=${sellerId}`, data); // Axios handles multipart
};


export const deleteProduct = (id) => {
  if (!id || id === "undefined") {
    throw new Error("Invalid productId passed to deleteProduct()");
  }
  return API.delete(`/seller/products/${id}`);
};

export const getSellerOrders = (page = 0, size = 10) =>
  API.get(`/seller/orders?page=${page}&size=${size}`);

export const updateSellerOrder = (orderId, status) =>
  API.put(`/seller/orders/${orderId}/status?status=${status}`);
