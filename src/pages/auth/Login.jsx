import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/authSlice";
import { fetchProfile } from "../../redux/slices/userSlice";
import { fetchSellerProfile } from "../../redux/slices/sellerSlice";
import { loadCart } from "../../redux/slices/cartSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value) => /^\+?\d{10,15}$/.test(value);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLocalError("");
  if (!username || !password) {
    setLocalError("All fields are required");
    return;
  }

  if (!isValidEmail(username) && !isValidPhone(username)) {
    setLocalError("Enter a valid email or phone number");
    return;
  }

  try {
    const resultAction = await dispatch(login({ username, password }));

    if (login.fulfilled.match(resultAction)) {
      const user = resultAction.payload;
      const role = user?.roles?.[0];
      if (role === "ROLE_SELLER") {
        console.log("Fetching seller profile...");
        await dispatch(fetchSellerProfile());
        navigate("/seller/dashboard");
      } 
      else if (role === "ROLE_USER") {
        await dispatch(fetchProfile());
        await dispatch(loadCart());
        navigate("/");
      } 
      else {
        navigate("/");
      }

    } else {
      setLocalError(resultAction.payload || "Invalid credentials");
    }

  } catch (err) {
    console.error("Login error:", err);
    setLocalError("Login failed. Please try again.");
  }
};

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md lg:max-w-2xl flex flex-col lg:flex-row gap-6">
        <form className="flex-1" onSubmit={handleSubmit} aria-label="Login Form">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Login
          </h2>

          {(error || localError) && (
            <div
              className="bg-red-100 text-red-700 p-2 rounded mb-4"
              role="alert"
              aria-live="assertive"
            >
              {localError || error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-1">
              Email or Phone
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email or phone"
              required
              className="w-full px-3 py-2 rounded border focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-500 mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 rounded border focus:ring focus:ring-blue-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex-1 flex flex-col justify-center items-center text-center mt-6 lg:mt-0">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Don't have an account?
          </p>
          <button
            onClick={() => navigate("/register/user")}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-md transition-all cursor-pointer"
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;