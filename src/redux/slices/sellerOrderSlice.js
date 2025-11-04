import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSellerOrders, updateSellerOrder } from "../../api/seller";

export const fetchSellerOrders = createAsyncThunk(
  "sellerOrders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSellerOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load seller orders");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "sellerOrders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await updateSellerOrder(orderId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
  }
);

const initialState = {
  orders: { content: [] },
  loading: false,
  error: null,
  updating: false,
};

const sellerOrderSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {
    clearSellerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || { content: [] };
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updating = false;
        const updatedOrder = action.payload;

        if (state.orders?.content?.length) {
          state.orders.content = state.orders.content.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          );
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { clearSellerError } = sellerOrderSlice.actions;
export default sellerOrderSlice.reducer;