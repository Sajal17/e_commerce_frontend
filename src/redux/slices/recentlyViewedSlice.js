import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRecentlyViewed, addRecentlyViewed } from "../../api/user";

// Helper: sanitize product data safely
const sanitizeProducts = (products) =>
  Array.isArray(products)
    ? products
        .filter(p => p && (p.id || p._id || p.productId))
        .map(p => ({ ...p, id: p.id || p._id || p.productId }))
    : [];

//  Load from localStorage
const loadLocal = () =>
  sanitizeProducts(JSON.parse(localStorage.getItem("recentlyViewed") || "[]"));

//  Save to localStorage
const saveLocal = (items) =>
  localStorage.setItem("recentlyViewed", JSON.stringify(items));



// Load recently viewed from server (only if logged in)
export const loadRecentlyViewed = createAsyncThunk(
  "recentlyViewed/load",
  async (_, { rejectWithValue }) => {
    return rejectWithValue("Guest mode - backend not used");
  }
);

export const addRecentlyViewedItem = createAsyncThunk(
  "recentlyViewed/add",
  async (_, { rejectWithValue }) => {
    return rejectWithValue("Guest mode - backend not used");
  }
);

const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState: {
    items: loadLocal(),
    loading: false,
    error: null,
  },
  reducers: {
    // Guest/local mode
    addLocalRecentlyViewed: (state, action) => {
      const product = sanitizeProducts([action.payload])[0];
      if (!product) return;

      state.items = [product, ...state.items.filter(p => p.id !== product.id)].slice(0, 10);
      saveLocal(state.items);
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
      localStorage.removeItem("recentlyViewed");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRecentlyViewed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRecentlyViewed.fulfilled, (state, action) => {
        state.loading = false;
        state.items = sanitizeProducts(action.payload);
        saveLocal(state.items);
      })
      .addCase(loadRecentlyViewed.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== "Guest user, skip server call") {
          state.error = action.payload;
        }
      })
      .addCase(addRecentlyViewedItem.fulfilled, (state, action) => {
        const product = action.payload;
        if (!product) return;
        state.items = [product, ...state.items.filter(p => p.id !== product.id)].slice(0, 10);
        saveLocal(state.items);
      });
  },
});

export const { addLocalRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;