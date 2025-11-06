import API from "./axiosInstance";

export const getUserProfile = () => API.get("/user/profile");
export const updateUserProfile = (data) => API.put("/user/profile", data);

export const getRecentlyViewed = (userId) => API.get(`/user/${userId}/recently-viewed`);
export const addRecentlyViewed = (userId, productId) =>
  API.post(`/user/${userId}/recently-viewed/${productId}`);
export const clearRecentlyViewed = (userId) =>
  API.delete(`/user/${userId}/recently-viewed`);

export const getUserById = (id) => API.get(`/user/${id}`);
export const updateUser = (id, data) => API.put(`/user/${id}`, data);
export const fetchUsers = () => API.get("/users");
export const deleteUser = (id) => API.delete(`/user/${id}`);
