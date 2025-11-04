import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAddresses,addAddress,updateAddress,deleteAddress } from "../../api/address";
export const loadAddresses = createAsyncThunk(
  "address/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchAddresses();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load addresses");
    }
  }
);
export const createAddress = createAsyncThunk(
  "address/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addAddress(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add address");
    }
  }
);

export const modifyAddress = createAsyncThunk(
  "address/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateAddress(id,data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update address");
    }
  }
);

export const removeAddress = createAsyncThunk(
  "address/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAddress(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete address");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(loadAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(modifyAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((a) =>
          a.id === action.payload.id ? action.payload : a
        );
      })
      .addCase(modifyAddress.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((a) => a.id !== action.payload);
      })
      .addCase(removeAddress.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
