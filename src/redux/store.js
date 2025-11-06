import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import categoryReducer from "./slices/categorySlice";
import similarReducer from "./slices/similarProductSlice";
import orderReducer from "./slices/orderSlice";
import paymentReducer from "./slices/paymentSlice";
import sellerReducer from "./slices/sellerSlice";
import searchReducer from "./slices/searchSlice";
import recentlyViewedReducer from "./slices/recentlyViewedSlice";
import authReducer from "./slices/authSlice";
import sellerProductsReducer from "./slices/sellerProductSlice";
import addressReducer from "./slices/addressSlice";
import sellerOrdersReducer from "./slices/sellerOrderSlice";
import adminReducer from "./slices/adminSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    address :addressReducer,
    products: productReducer,
    cart: cartReducer,
    categories: categoryReducer,
    similar:similarReducer,
    orders: orderReducer,
    payments: paymentReducer,
    seller: sellerReducer,
    sellerOrder:sellerOrdersReducer,
    admin: adminReducer,
    sellerProducts: sellerProductsReducer,
    search: searchReducer,
    auth: authReducer,
    recentlyViewed: recentlyViewedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.MODE !== "production",
});

export default store;
