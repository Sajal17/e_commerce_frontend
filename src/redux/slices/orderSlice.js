import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUserOrders,
  createOrder,
  getOrderById,
  cancelOrder,
} from "../../api/order";

const handleError = (err, fallback) =>
  err.response?.data?.message ||
  err.response?.data?.error ||
  err.message ||
  fallback;

export const loadOrders = createAsyncThunk(
  "orders/load",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetchUserOrders(userId);
      return res.data;
    } catch (err) {
      return rejectWithValue(handleError(err, "Failed to load orders"));
    }
  }
);

export const placeOrder = createAsyncThunk(
  "orders/place",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createOrder(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(handleError(err, "Failed to place order"));
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await getOrderById(orderId);
      return res.data;
    } catch (err) {
      return rejectWithValue(handleError(err, "Failed to fetch order details"));
    }
  }
);

export const cancelUserOrder = createAsyncThunk(
  "orders/cancel",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await cancelOrder(orderId);
      return res.data;
    } catch (err) {
      return rejectWithValue(handleError(err, "Failed to cancel order"));
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    selectedOrder: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearOrderState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.list = action.payload.content || [];
        state.loading = false;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.loading = false;
        state.success = "Order placed successfully";
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        state.loading = false;
      })
      .addCase(cancelUserOrder.fulfilled, (state, action) => {
        const canceledId = action.payload.id || action.meta.arg;
        state.list = state.list.map((o) =>
          o.id === canceledId ? { ...o, status: "CANCELLED" } : o
        );
        state.loading = false;
        state.success = "Order cancelled successfully";
      })
      .addMatcher(
        (a) => a.type.startsWith("orders/") && a.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = null;
        }
      )
      .addMatcher(
        (a) => a.type.startsWith("orders/") && a.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          console.error("Order error:", action.payload);
        }
      );
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;