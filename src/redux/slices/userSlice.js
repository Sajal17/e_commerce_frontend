// // redux/slices/userSlice.js
import { createSlice, createAsyncThunk ,createSelector} from "@reduxjs/toolkit";
import { getUserProfile, updateUserProfile } from "../../api/user";

const isLoggedIn = () => !!localStorage.getItem("token");

// Async Thunks
export const fetchProfile = createAsyncThunk("user/fetchProfile", async (_, { rejectWithValue }) => {
  try { if (!isLoggedIn()) return null; 
    return (await getUserProfile()).data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to load profile"); }
});

export const updateProfile = createAsyncThunk("user/updateProfile", async (data, { rejectWithValue }) => {
  try { if (!isLoggedIn()) return rejectWithValue("User not logged in"); return (await updateUserProfile(data)).data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || "Update failed"); }
});

// Slice
const userSlice = createSlice({
  name: "user",
  initialState: { currentUser: null, loading: false, error: null },
  reducers: {  clearUser: (state) => { state.currentUser = null; localStorage.removeItem("token"); localStorage.removeItem("user"); } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; if(action.payload) localStorage.setItem("user", JSON.stringify(action.payload)); })
      .addCase(fetchProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateProfile.pending, state => { state.loading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; if(action.payload) localStorage.setItem("user", JSON.stringify(action.payload)); })
      .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});
export const selectUser = (state) => state.user.currentUser; 
export const { clearUser } = userSlice.actions;
export default userSlice.reducer;