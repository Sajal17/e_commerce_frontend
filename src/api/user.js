import API from "./axiosInstance"; // axios instance with token handling

// 🔹 User profile
export const getUserProfile = () => API.get("/user/profile");
export const updateUserProfile = (data) => API.put("/user/profile", data);

// 🔹 Recently viewed products
export const getRecentlyViewed = (userId) => API.get(`/user/${userId}/recently-viewed`);
export const addRecentlyViewed = (userId, productId) =>
  API.post(`/user/${userId}/recently-viewed/${productId}`);
export const clearRecentlyViewed = (userId) =>
  API.delete(`/user/${userId}/recently-viewed`);

// 🔹 Admin endpoints (optional)
export const getUserById = (id) => API.get(`/user/${id}`);
export const updateUser = (id, data) => API.put(`/user/${id}`, data);
export const fetchUsers = () => API.get("/users");
export const deleteUser = (id) => API.delete(`/user/${id}`);

/*
/ 🔹 Admin endpoints (requires ADMIN role)
export const getUserById = (id) => API.get(`/admin/user/${id}`);
export const updateUser = (id, data) => API.put(`/admin/user/${id}`, data);
export const fetchUsers = () => API.get("/admin/users");
export const deleteUser = (id) => API.delete(`/admin/user/${id}`); */

