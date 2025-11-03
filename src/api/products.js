import API from "./axiosInstance"; // Authenticated routes
import publicAPI from "./publicAPI"; // Guest routes

// Helper to check if user is logged in
const isLoggedIn = () => !!localStorage.getItem("token");

// Fetch all products 
export const fetchProducts = async () => {
  try {
    const client = isLoggedIn() ? API : publicAPI;
    const response = await client.get("/public/products");

    return response.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};
// Fetch single product by ID
export const fetchProductById = async (id) => {
  if (!id) throw new Error("Product ID is required");
  try {
    const client = isLoggedIn() ? API : publicAPI;
    const response = await client.get(`/public/products/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching product with id ${id}:`, err);
    throw err;
  }
};

/** Search products by query */
export const searchProducts = async (query) => {
  if (!query) return [];
  try {
    const client = isLoggedIn() ? API : publicAPI;
    const response = await client.get(
      `/public/products/search?query=${encodeURIComponent(query)}`
    );
    console.log("searchProducts response.data:", response.data); // 🔹 add this
    return response.data;
  } catch (err) {
    console.error(`Error searching products with query "${query}":`, err);
     return [];
  }
};

// import API from "./axiosInstance"; // for authenticated routes
// import publicAPI from "./publicAPI"; // for guests

// const isLoggedIn = () => !!localStorage.getItem("token");

// // Fetch all products
// export const fetchProducts = async () => {
//   try {
//     const client = isLoggedIn() ? API : publicAPI;
//     return await client.get("/public/products");
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     throw err;
//   }
// };

// // Fetch single product by ID
// export const fetchProductById = async (id) => {
//   try {
//     const client = isLoggedIn() ? API : publicAPI;
//     return await client.get(`/public/products/${id}`);
//   } catch (err) {
//     console.error("Error fetching product:", err);
//     throw err;
//   }
// };

// // Search products
// export const searchProducts = async (query) => {
//   try {
//     const client = isLoggedIn() ? API : publicAPI;
//     return await client.get(
//       `/public/products/search?query=${encodeURIComponent(query)}`
//     );
//   } catch (err) {
//     console.error("Error searching products:", err);
//     throw err;
//   }
// };


// import API from "./axiosInstance";


// export const fetchProducts = async () => {
//   const token = localStorage.getItem("token");

//   // For guests: check cached products first
//   if (!token) {
//     const cached = JSON.parse(localStorage.getItem("products"));
//     if (cached?.length) {
//       console.log("Loaded products from local cache (guest)");
//       return { data: cached };
//     }
//   }
//   // Fetch from backend
//   const response = await API.get("/public/products");
//    // Cache for guests
//   if (!token) {
//     localStorage.setItem("products", JSON.stringify(response.data));
//   }

//   return response;
// };

// // Fetch single product by ID (public)
// export const fetchProductById = (id) => API.get(`/public/products/${id}`);
//  // Search products by query (public)
// export const searchProducts = async (query) => {
//   return API.get(`/public/products/search?query=${encodeURIComponent(query)}`);
// };

/* ----------------- Seller CRUD APIs ----------------- */
// For production, we only send JSON now since images are uploaded to Cloudinary
// export const addProductApi = (productData) =>
//   axios.post(`${API_URL}/seller/products`, productData, { withCredentials: true });

// export const updateProductApi = (id, productData) =>
//   axios.put(`${API_URL}/seller/products/${id}`, productData, { withCredentials: true });

// export const deleteProductApi = (id) =>
//   axios.delete(`${API_URL}/seller/products/${id}`, { withCredentials: true });


/*
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Public products
export const fetchProducts = () => axios.get(`${API_URL}/products`);
export const fetchProductById = (id) =>
  axios.get(`${API_URL}/products/${id}`);
export const fetchProductsByCategory = (category) =>
  axios.get(`${API_URL}/products/search?keyword=${category}`);
export const searchProducts = (query) =>
  axios.get(`${API_URL}/products/search?q=${query}`);

// Seller CRUD
export const addProductApi = (productData) =>
  axios.post(`${API_URL}/seller/products`, productData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

export const updateProductApi = (id, productData) =>
  axios.put(`${API_URL}/seller/products/${id}`, productData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

export const deleteProductApi = (id) =>
  axios.delete(`${API_URL}/seller/products/${id}`, { withCredentials: true });
*/
