import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { loginUser, logoutUser, registerUser, registerSeller } from "../../api/auth";
import { fetchProfile as fetchUserProfile } from "./userSlice";
import { fetchSellerProfile as fetchSellerProfileAPI } from "./sellerSlice";
import { getUserProfile } from "../../api/user";
import { getOwnSellerProfile } from "../../api/seller";
import {jwtDecode} from "jwt-decode";

const getTokenFromStorage = () => localStorage.getItem("token") || null;

const normalizeUser = (profileData) => {
  if (!profileData) return null;

  const roles = Array.isArray(profileData.role) ? profileData.role : [profileData.role];
  const role = roles[0] || null;
  return { ...profileData, roles, role };
};


const userFromStorage = JSON.parse(localStorage.getItem("user"));
const tokenFromStorage = getTokenFromStorage();
if (!tokenFromStorage) {
  localStorage.removeItem("user");
}
const initialState = {
  user: tokenFromStorage ? normalizeUser(userFromStorage) : null,
  token: tokenFromStorage,
  loading: false,
  error: null,
};

export const registerNewUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await registerUser(userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "User registration failed");
    }
  }
);

export const registerNewSeller = createAsyncThunk(
  "auth/registerSeller",
  async (sellerData, { rejectWithValue }) => {
    try {
      const res = await registerSeller(sellerData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Seller registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginUser(credentials);
      const token = res.data?.accessToken;
      if (!token) return rejectWithValue("Login failed — no token");

      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      const roles = decoded?.roles || decoded?.authorities || [];
      const primaryRole = Array.isArray(roles) ? roles[0] : roles;
      let profile;
      if (primaryRole === "ROLE_SELLER") {
        profile = await getOwnSellerProfile();
      } else {
        profile = await getUserProfile();
      }
      const normalized = normalizeUser(profile.data || profile);
      localStorage.setItem("user", JSON.stringify(normalized));

      return normalized;
    } catch (err) {
      console.error("Login failed:", err);
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);


export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Logout API failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: "user/clearUser" });
      dispatch({ type: "seller/clearSeller" });
    }
    return true;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = normalizeUser(action.payload);
        state.token = getTokenFromStorage();
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerNewUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerNewUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerNewUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerNewSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerNewSeller.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerNewSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.user = normalizeUser(action.payload.data || action.payload);
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.user = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      .addCase(fetchSellerProfileAPI.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.user = normalizeUser(action.payload.data || action.payload);
      })
      .addCase(fetchSellerProfileAPI.rejected, (state) => {
        state.user = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const selectNormalizedUser = createSelector(
  [(state) => state.auth.user],
  (user) => {
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      roles: user.roles,
    };
  }
);

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;