import API from "./axiosInstance";

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register/user", data);
export const registerSeller = (data) => API.post("/auth/register/seller", data);
export const logoutUser = () => API.post("/auth/logout");
