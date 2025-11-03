import axios from "axios";

const publicAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: { "Content-Type": "application/json" },
});

export default publicAPI;