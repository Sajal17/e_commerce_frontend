import API from "./axiosInstance";
import publicAPI from "./publicAPI";

const isLoggedIn = () => !!localStorage.getItem("token");

// Public
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

//export const getCategoryById = (id) => API.get(`/categories/${id}`);

// // Add new category (admin only)
// export const addCategory = (data) => axios.post(`${API_URL}/categories`, data, { withCredentials: true });

// // Update category (admin only)
// export const updateCategory = (id, data) => axios.put(`${API_URL}/categories/${id}`, data, { withCredentials: true });

// // Delete category (admin only)
// export const deleteCategory = (id) => axios.delete(`${API_URL}/categories/${id}`, { withCredentials: true });