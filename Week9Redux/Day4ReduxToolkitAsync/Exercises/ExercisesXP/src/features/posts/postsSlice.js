import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL } from "../../app/api.js";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (_, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}/posts?_limit=10`);
  if (!response.ok) {
    return rejectWithValue(`Server answered ${response.status}`);
  }
  return response.json();
});

const postsSlice = createSlice({
  name: "posts",
  // status: "idle" | "loading" | "succeeded" | "failed"
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        // rejectWithValue fills action.payload; a network error only fills action.error
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const selectPosts = state => state.posts.items;
export const selectPostsStatus = state => state.posts.status;
export const selectPostsError = state => state.posts.error;
export default postsSlice.reducer;
