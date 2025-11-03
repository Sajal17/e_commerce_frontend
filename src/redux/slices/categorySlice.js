import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductsByCategory } from "../../api/category";

const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours
const isLoggedIn = () => !!localStorage.getItem("token");

// Async thunk to load categories
export const loadCategories = createAsyncThunk(
  "categories/load",
  async (_, { rejectWithValue }) => {
    try {
      const cached = JSON.parse(localStorage.getItem("categories") || "null");

      // Use cache if valid
      if (cached && cached.timestamp && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      // Fetch from API
      const res = await fetchProductsByCategory();
      const categories = res; // assuming fetchCategories() returns the data array

      // Store in localStorage with timestamp
      localStorage.setItem(
        "categories",
        JSON.stringify({ data: categories, timestamp: Date.now() })
      );

      return categories;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load categories"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearCategories: (state) => {
      state.list = [];
      state.error = null;
      state.lastUpdated = null;
      localStorage.removeItem("categories");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategories } = categorySlice.actions;
export default categorySlice.reducer;
