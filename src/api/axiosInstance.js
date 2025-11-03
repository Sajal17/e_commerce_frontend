import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true, // if using cookies
});

// Attach JWT automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  //console.log("Token before request:", token);
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
 // console.log("Final headers:", config.headers);
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      console.warn("Token expired — auto logout");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default API;