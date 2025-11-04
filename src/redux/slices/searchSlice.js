import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchProducts } from "../../api/products";

const isLoggedIn = () => !!localStorage.getItem("token");

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (query, { rejectWithValue }) => {
    try {
      if (!isLoggedIn()) {
        const cachedSearch = JSON.parse(localStorage.getItem("searchCache")) || {};
        if (cachedSearch[query]) return cachedSearch[query];
      }

      const results = await searchProducts(query);
      if (!isLoggedIn()) {
        const cachedSearch = JSON.parse(localStorage.getItem("searchCache")) || {};
        cachedSearch[query] = results;
        localStorage.setItem("searchCache", JSON.stringify(cachedSearch));
      }

      return results;
    } catch (err) {
      return rejectWithValue(err.message || "Search failed");
    }
  }
);

const saveRecentSearch = (query) => {
  let recent = JSON.parse(localStorage.getItem("recentSearches") || "[]");
  recent = recent.filter((q) => q.toLowerCase() !== query.toLowerCase());

  recent.unshift(query);
  recent = recent.slice(0, 10);

  localStorage.setItem("recentSearches", JSON.stringify(recent));
};


const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchTerm: "",
    selectedCategory: "",
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.selectedCategory = "";
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
       state.results = Array.isArray(action.payload) ? action.payload : [];
        const query = state.searchTerm;
  if (query && query.trim() !== "") {
    saveRecentSearch(query);
  }
        })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setSearchTerm, setCategory, clearSearch } = searchSlice.actions;
export { saveRecentSearch };
export default searchSlice.reducer;