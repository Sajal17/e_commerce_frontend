import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Loader from "./components/Loader";
import { setCategory, setSearchTerm } from "./redux/slices/searchSlice";
import { fetchProfile } from "./redux/slices/userSlice";
import { fetchSellerProfile } from "./redux/slices/sellerSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import { loadCart } from "./redux/slices/cartSlice";
// Lazy-loaded pages
const Home = lazy(() => import("./pages/public/Home"));
const ProductDetail = lazy(() => import("./pages/products/ProductDetails"));
const CategoryProducts = lazy(() => import("./pages/public/CategoryProducts"));
const SearchResults = lazy(() =>import("./pages/public/SearchResults"));
const Cart = lazy(() => import("./pages/user/Cart"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// User Pages
const Profile = lazy(() => import("./pages/user/Profile"));
const Orders = lazy(() => import("./pages/user/Orders"));
const Checkout = lazy(() => import("./pages/user/Checkout"));

// Seller pages
const SellerDashboard = lazy(() => import("./pages/seller/SellerDashboard"));
const AddProduct = lazy(() => import("./pages/seller/AddProduct"));
const EditProduct = lazy(() => import("./pages/seller/EditProduct"));
const SellerProducts = lazy(() => import("./pages/seller/SellerProducts"));
const SellerProfile = lazy(() => import("./components/seller/SellerProfile"));
const SellerOrders = lazy(()=> import("./pages/seller/SellerOrders"));
export default function App() {
  const dispatch = useDispatch();
  const { searchTerm, selectedCategory } = useSelector((state) => state.search);

 useEffect(() => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const savedSeller = JSON.parse(localStorage.getItem("seller"));
  const activeAccount = savedUser || savedSeller;
   
  dispatch(loadCart());
  if (!activeAccount) return;

  const roles =
    activeAccount.roles?.map((r) => r.replace("ROLE_", "").toUpperCase()) || [];

  if (roles.includes("SELLER")) {
    dispatch(fetchSellerProfile());
  } else if (roles.includes("USER")) {
    dispatch(fetchProfile());
  }
}, [dispatch]);


  return (
    <>
      <Navbar onSelectCategory={(c) => dispatch(setCategory(c))} onSearch={(t) => dispatch(setSearchTerm(t))} />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home searchTerm={searchTerm} selectedCategory={selectedCategory} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:categoryName" element={<CategoryProducts/>}/>
            <Route path="/search" element={<SearchResults/>}/>
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/user" element={<Register />} />

            {/* User Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute allowedRoles={["USER"]}><Profile /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={["USER"]}><Orders /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute allowedRoles={["USER"]}><Checkout /></ProtectedRoute>} />

            {/* Seller Protected Nested Routes */}
            <Route
              path="/seller/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            >
              {/* Nested Routes inside dashboard */}
              <Route index element={<SellerProfile />} /> {/* default */}
              <Route path="profile" element={<SellerProfile />} />
              <Route path="products" element={<SellerProducts />} />
              <Route path="addProduct" element={<AddProduct />} />
              <Route path="product/edit/:id" element={<EditProduct />} />
              <Route path="orders" element={<SellerOrders />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div className="p-10 text-center text-lg">Page Not Found</div>} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </>
  );
}