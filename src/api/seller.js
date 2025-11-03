import API from "./axiosInstance";

// Get seller profile
export const getOwnSellerProfile = () => API.get(`/seller/profile`);
export const updateSellerProfile = (data) => API.put(`/seller/profile`, data);
export const deleteSellerProfile = () => API.delete(`/seller/profile`);

// Products
export const getSellerProducts = () => API.get(`/seller/products`);
export const getSingleProduct = (productId) => API.get(`/seller/products/${productId}`);

// Add a new product (FormData)
export const addProduct = (data) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const sellerId = user?.id;
  return API.post(`/seller/products?sellerId=${sellerId}`, data); // Axios handles multipart
};

// Update a product (FormData)
export const updateProduct = (productId, data) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const sellerId = user?.id;
  return API.put(`/seller/products/${productId}?sellerId=${sellerId}`, data); // Axios handles multipart
};

// Delete a product
export const deleteProduct = (id) => {
  if (!id || id === "undefined") {
    throw new Error("Invalid productId passed to deleteProduct()");
  }
  return API.delete(`/seller/products/${id}`);
};

// export const getSellerOrders = () => API.get(`/seller/orders`);
export const getSellerOrders = (page = 0, size = 10) =>
  API.get(`/seller/orders?page=${page}&size=${size}`);

export const updateSellerOrder = (orderId, status) =>
  API.put(`/seller/orders/${orderId}/status?status=${status}`);












// import API from "./axiosInstance";

// //  Get seller's own profile (requires auth)
// export const getOwnSellerProfile = () => API.get(`/seller/profile`);
// //  Update seller profile
// export const updateSellerProfile = (data) => API.put(`/seller/profile`, data);
// //  delete seller profile
// export const deleteSellerProfile = () => API.delete(`/seller/profile`);
// //  Get all products for a specific seller
// export const getSellerProducts = (sellerId) =>API.get(`/seller/${sellerId}/products`);
// //  Get a single product by ID
// export const getSingleProduct = (productId) =>API.get(`/seller/products/${productId}`);
// //  Add a new product (FormData)
// export const addProduct = (data) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const sellerId = user?.id;

//   return API.post(`/seller/products?sellerId=${sellerId}`, data, {
//     headers: {
//       ...API.defaults.headers,
//       "Content-Type": "multipart/form-data", // Axios will handle boundary
//     },
//   });
// };


// // Update product
// export const updateProduct = (productId, data) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const sellerId = user?.id;

//   return API.put(`/seller/products/${productId}?sellerId=${sellerId}`, data, {
//     headers: {
//       ...API.defaults.headers,
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };

// //  Delete a product
// export const deleteProduct = (productId) => API.delete(`/seller/products/${productId}`);