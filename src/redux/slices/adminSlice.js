import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsers as fetchAllUsers,
  fetchAllSellers,
  fetchAllOrders,
  fetchAllProducts,
  deleteUser,
  deleteSeller,
  deleteProductByAdmin as deleteProduct,
  updateOrderStatus,
  approveSeller,
} from "../../api/admin";

// Generic handler to wrap API calls
const handleApiCall = async (apiCall, args, { rejectWithValue }) => {
  try {
    const res = await apiCall(...args);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Request failed");
  }
};

// ✅ Async thunks
export const loadUsers = createAsyncThunk("admin/loadUsers", async (_, ctx) =>
  handleApiCall(fetchAllUsers, [], ctx)
);
export const loadSellers = createAsyncThunk("admin/loadSellers", async (_, ctx) =>
  handleApiCall(fetchAllSellers, [], ctx)
);
export const loadProducts = createAsyncThunk("admin/loadProducts", async (_, ctx) =>
  handleApiCall(fetchAllProducts, [], ctx)
);
export const loadOrders = createAsyncThunk("admin/loadOrders", async (_, ctx) =>
  handleApiCall(fetchAllOrders, [], ctx)
);

export const removeUser = createAsyncThunk("admin/removeUser", async (id, ctx) =>
  handleApiCall(deleteUser, [id], ctx).then(() => id)
);
export const removeSeller = createAsyncThunk("admin/removeSeller", async (id, ctx) =>
  handleApiCall(deleteSeller, [id], ctx).then(() => id)
);
export const removeProduct = createAsyncThunk("admin/removeProduct", async (id, ctx) =>
  handleApiCall(deleteProduct, [id], ctx).then(() => id)
);

export const changeOrderStatus = createAsyncThunk(
  "admin/changeOrderStatus",
  async ({ orderId, status }, ctx) => handleApiCall(updateOrderStatus, [orderId, status], ctx)
);

export const approveSellerAccount = createAsyncThunk(
  "admin/approveSeller",
  async (sellerId, ctx) => handleApiCall(approveSeller, [sellerId], ctx)
);

// ✅ Slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    sellers: [],
    products: [],
    orders: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearAdminState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })

      // Sellers
      .addCase(loadSellers.fulfilled, (state, action) => {
        state.sellers = action.payload;
      })
      .addCase(removeSeller.fulfilled, (state, action) => {
        state.sellers = state.sellers.filter((s) => s.id !== action.payload);
      })
      .addCase(approveSellerAccount.fulfilled, (state, action) => {
        state.sellers = state.sellers.map((s) =>
          s.id === action.payload.id ? { ...s, status: "APPROVED" } : s
        );
      })

      // Products
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })

      // Orders
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((o) =>
          o.id === action.payload.id ? { ...o, status: action.payload.status } : o
        );
      })

      // Common loading/error handling
      .addMatcher(
        (a) => a.type.startsWith("admin/") && a.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (a) => a.type.startsWith("admin/") && a.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (a) => a.type.startsWith("admin/") && a.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
