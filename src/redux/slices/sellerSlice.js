import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { getOwnSellerProfile, updateSellerProfile,deleteSellerProfile } from "../../api/seller";
const isLoggedIn = () => !!localStorage.getItem("token");
export const fetchSellerProfile = createAsyncThunk(
  "seller/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getOwnSellerProfile();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch seller data");
    }
  }
);

export const updateSeller = createAsyncThunk(
  "seller/update",
  async ( data, { rejectWithValue }) => {
    try {
      if (!isLoggedIn()) return rejectWithValue("User not logged in");
      const res = await updateSellerProfile(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update seller");
    }
  }
);

export const deleteSeller = createAsyncThunk(
  "seller/delete",
  async ( data, { rejectWithValue }) => {
    try {
      if (!isLoggedIn()) return rejectWithValue("User not logged in");
      const res = await deleteSellerProfile(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update seller");
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSeller: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        if (action.payload) localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      .addCase(updateSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        
        if (action.payload) localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     .addCase(deleteSeller.fulfilled, (state) => {
  state.loading = false;
  state.data = null;
  localStorage.removeItem("user"); 
})
.addCase(deleteSeller.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
  },
});

export const selectSeller = (state) => state.seller.data;

export const { clearSeller } = sellerSlice.actions;
export default sellerSlice.reducer;
