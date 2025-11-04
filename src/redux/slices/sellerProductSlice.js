import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSellerProducts, addProduct, updateProduct, deleteProduct } from "../../api/seller";

export const fetchSellerProducts = createAsyncThunk(
  "sellerProducts/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getSellerProducts();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const createProduct = createAsyncThunk(
  "sellerProducts/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addProduct(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add product");
    }
  }
);

export const editProduct = createAsyncThunk(
  "sellerProducts/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateProduct(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update product");
    }
  }
);

export const removeProduct = createAsyncThunk(
  "sellerProducts/delete",
  async (id, { rejectWithValue }) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid product ID");
      }
      await deleteProduct(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const sellerProductSlice = createSlice({
  name: "sellerProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearSellerProductState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
 
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.loading = false;
        state.success = "Product added successfully";
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.products = state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        );
        state.loading = false;
        state.success = "Product updated successfully";
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
        state.loading = false;
        state.success = "Product deleted successfully";
      })

      .addMatcher(
        action => action.type.startsWith("sellerProducts/") && action.type.endsWith("/pending"),
        state => {
          state.loading = true;
          state.error = null;
          state.success = null;
        }
      )

      .addMatcher(
        action => action.type.startsWith("sellerProducts/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearSellerProductState } = sellerProductSlice.actions;
export const selectSellerProducts = state => state.sellerProducts.products;
export default sellerProductSlice.reducer;
