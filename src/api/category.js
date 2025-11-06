import API from "./axiosInstance";
import publicAPI from "./publicAPI";

const isLoggedIn = () => !!localStorage.getItem("token");

export const fetchProductsByCategory = async (category) => {
  if (!category) throw new Error("Category is required");
  try {
    console.log("Calling API for category:", category); 
    const client = isLoggedIn() ? API : publicAPI;
    const response = await client.get(
      `/public/products?category=${encodeURIComponent(category)}`
    );
    console.log("API response data:", response.data);
    return response.data;
  } catch (err) {
    console.error(`Error fetching products in category "${category}":`, err);
    throw err;
  }
};