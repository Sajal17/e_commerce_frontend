import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import publicAPI from "../../api/publicAPI";
import API from "../../api/axiosInstance";

const isLoggedIn = () => !!localStorage.getItem("token");
export const fetchSimilarProducts = createAsyncThunk(
  "similar/fetch",
  async (category, { rejectWithValue }) => {
    try {
      if (!category) return [];
      const client = isLoggedIn() ? API : publicAPI;
      const response = await client.get(`/public/products?category=${category}`);
      return response.data;
    } catch (err) {
      console.error("Error fetching similar products:", err);
      return rejectWithValue(err.message);
    }
  }
);

const similarProductSlice = createSlice({
  name: "similar",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default similarProductSlice.reducer;
