import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  initiatePayment,
  verifyPayment,
  fetchPaymentHistory,
} from "../../api/payment";

// 🪙 Start a new payment session
export const startPayment = createAsyncThunk(
  "payment/start",
  async ({ orderId, data }, { rejectWithValue }) => {
    try {
      const res = await initiatePayment(orderId, data);
      return res.data; // Expecting payment session or payment URL
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to start payment");
    }
  }
);

// ✅ Verify payment after callback (e.g. Razorpay / Stripe webhook or return URL)
export const confirmPayment = createAsyncThunk(
  "payment/confirm",
  async (paymentId, { rejectWithValue }) => {
    try {
      const res = await verifyPayment(paymentId);
      return res.data; // Payment verification details
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Payment verification failed");
    }
  }
);

// 💳 Load payment history for a user
export const loadPaymentHistory = createAsyncThunk(
  "payment/history",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchPaymentHistory();
      return res.data; // Array of payments
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load payment history");
    }
  }
);

// 🧩 Payment Slice
const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    history: [],
    currentPayment: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearPaymentState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🚀 Start Payment
      .addCase(startPayment.fulfilled, (state, action) => {
        state.currentPayment = action.payload;
        state.loading = false;
        state.success = "Payment initiated successfully";
      })

      // ✅ Confirm Payment
      .addCase(confirmPayment.fulfilled, (state, action) => {
        // Update payment status in history or add it
        const updated = action.payload;
        const existing = state.history.find((p) => p.id === updated.id);
        if (existing) {
          Object.assign(existing, updated);
        } else {
          state.history.push(updated);
        }
        state.loading = false;
        state.success = "Payment confirmed successfully";
      })

      // 🧾 Load Payment History
      .addCase(loadPaymentHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.loading = false;
      })

      // 🕒 Handle common async states
      .addMatcher(
        (a) => a.type.startsWith("payment/") && a.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = null;
        }
      )
      .addMatcher(
        (a) => a.type.startsWith("payment/") && a.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;

