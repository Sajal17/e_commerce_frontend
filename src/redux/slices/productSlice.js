import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProducts, fetchProductById } from "../../api/products";

// Helper: check if user is logged in
const isLoggedIn = () => !!localStorage.getItem("token");

// Load all products (public)
export const loadProducts = createAsyncThunk(
  "products/load",
  async (_, { rejectWithValue }) => {
    try {
      // Guest: return cached products if available
      if (!isLoggedIn()) {
        const cached = JSON.parse(localStorage.getItem("products"));
        if (cached?.length) return cached;
      }

      // Fetch from backend
      const res = await fetchProducts();
      // Cache for guests
      if (!isLoggedIn()) localStorage.setItem("products", JSON.stringify(res.data));

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load products");
    }
  }
);

// Load single product by ID (public)
export const loadProductById = createAsyncThunk(
  "products/loadById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetchProductById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load product");
    }
  }
);

// -----------------------------
// Slice
// -----------------------------
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.items = [];
      state.selected = null;
      state.error = null;
      localStorage.removeItem("products");
    },
  },
  extraReducers: (builder) => {
    builder
      // Load all products
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load single product by ID
      .addCase(loadProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(loadProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;