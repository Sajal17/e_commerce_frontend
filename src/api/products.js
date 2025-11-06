import API from "./axiosInstance";
import publicAPI from "./publicAPI";

const isLoggedIn = () => !!localStorage.getItem("token");
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

export const searchProducts = async (query) => {
  if (!query) return [];
  try {
    const client = isLoggedIn() ? API : publicAPI;
    const response = await client.get(
      `/public/products/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (err) {
    console.error(`Error searching products with query "${query}":`, err);
     return [];
  }
};