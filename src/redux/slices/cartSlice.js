import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../../api/cart";

const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return token && token !== "undefined" && token !== "null";
};

const findMatch = (item, id) => {
  if (!item || !id) return false;
  const normalizedItemId =
    String(item.id || item._id || item.productId).trim();
  const normalizedId = String(id).trim();
  return normalizedItemId === normalizedId;
};
// 🟩 Always normalize data shape
const normalize = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.cart)) return data.cart;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.cart?.items)) return data.cart.items;
  return [];
};
// 🟩 LOAD CART
export const loadCart = createAsyncThunk(
  "cart/load",
  async (_, { rejectWithValue }) => {
    try {
      if (isLoggedIn()) {
        const guestCart = JSON.parse(localStorage.getItem("cart")) || [];
        let userCart = (await getCart()).data;
        userCart = normalize(userCart);

        // Merge guest + user
        const merged = [...userCart];
        guestCart.forEach((item) => {
          const exist = merged.find((i) => findMatch(i, item.id));
          if (exist) exist.quantity += item.quantity;
          else merged.push(item);
        });

        localStorage.removeItem("cart");
        return merged;
      }
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load cart"
      );
    }
  }
);

// ADD ITEM
export const addItemToCart = createAsyncThunk(
  "cart/add",
  async (item, { rejectWithValue }) => {
    try {
      if (!isLoggedIn()) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((i) => findMatch(i, item.id));
        if (existing) existing.quantity += item.quantity || 1;
        else cart.push({ ...item, quantity: item.quantity || 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        return cart;
      }
      const res = await addToCart(item.id, item.quantity || 1);
      return normalize(res.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

// Increase quantity
export const increaseQuantity = createAsyncThunk(
  "cart/increase",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const items = cart.items || [];

      console.log("🧩 increaseQuantity called with:", productId);
      console.log("🧩 Current items:", items);

      const item = items.find((i) => findMatch(i, productId));

      if (!item) {
        console.warn("⚠️ No matching item found for:", productId);
        return rejectWithValue("Item not found");
      }

      if (!isLoggedIn()) {
        const updated = items.map((i) =>
          findMatch(i, productId)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );

        console.log("⬆️ Increasing:", productId);
        console.log("🆕 Updated cart:", updated);

        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      }

      const res = await updateQuantity(productId, item.quantity + 1);
      return normalize(res.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to increase quantity"
      );
    }
  }
);


// Decrease quantity
export const decreaseQuantity = createAsyncThunk(
  "cart/decrease",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const items = cart.items || [];
      const item = items.find(i => findMatch(i, productId));
      if (!item || item.quantity <= 1) return rejectWithValue("Cannot decrease below 1");

      if (!isLoggedIn()) {
        const updated = items.map(i =>
          findMatch(i, productId) ? { ...i, quantity: i.quantity - 1 } : i
        );
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      }

      const res = await updateQuantity(productId, item.quantity - 1);
      return res.data.items || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to decrease quantity");
    }
  }
);


// REMOVE ITEM
export const removeLocalItem = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      if (!isLoggedIn()) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const updated = cart.filter((i) => !findMatch(i, productId));
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      }
      const res = await removeFromCart(productId);
      return normalize(res.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

// CLEAR CART
export const clearCartAsync = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      if (!isLoggedIn()) {
        localStorage.removeItem("cart");
        return [];
      }
      const res = await clearCart();
      return normalize(res.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
  builder
    .addCase(loadCart.fulfilled, (state, action) => {
      state.items = normalize(action.payload);
    })
    .addCase(addItemToCart.fulfilled, (state, action) => {
      state.items = normalize(action.payload);
    })
    .addCase(increaseQuantity.fulfilled, (state, action) => {
  const updated = normalize(action.payload);
  state.items = updated;
  localStorage.setItem("cart", JSON.stringify(updated));
})
.addCase(decreaseQuantity.fulfilled, (state, action) => {
  const updated = normalize(action.payload);
  state.items = updated;
  localStorage.setItem("cart", JSON.stringify(updated));
})
    .addCase(removeLocalItem.fulfilled, (state, action) => {
      state.items = normalize(action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    })
    .addCase(clearCartAsync.fulfilled, (state, action) => {
      state.items = normalize(action.payload);
      localStorage.removeItem("cart");
    })
    .addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    )
    .addMatcher(
      (action) => action.type.endsWith("/fulfilled"),
      (state) => {
        state.loading = false;
      }
    )
    .addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
}

});

export const selectCartItems = (state) => state.cart.items;
export default cartSlice.reducer;