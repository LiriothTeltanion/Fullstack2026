import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "./api";
import type { Story, User } from "./types";
import { sessionChanged } from "./authSlice";

interface StoryState {
  stories: Story[];
  loading: boolean;
  loaded: boolean;
  error: string;
  requestId: string | null;
}
const initialState: StoryState = {
  stories: [],
  loading: false,
  loaded: false,
  error: "",
  requestId: null,
};

export const fetchStories = createAsyncThunk(
  "story/fetch",
  async () => (await api.stories()).stories,
  {
    condition: (_, { getState }) =>
      Boolean((getState() as { auth: { user: User | null } }).auth.user),
  }
);

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    errorChanged(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sessionChanged, state => {
        // Invalidate pending requests whenever accounts change or sign out.
        state.stories = [];
        state.error = "";
        state.loading = false;
        state.loaded = false;
        state.requestId = null;
      })
      .addCase(fetchStories.pending, (state, action) => {
        state.loading = true;
        state.error = "";
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.stories = action.payload;
        state.loading = false;
        state.loaded = true;
        state.requestId = null;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.loading = false;
        state.requestId = null;
        state.error = action.error.message ?? "Could not load stories";
      });
  },
});
export const { errorChanged } = storySlice.actions;
export default storySlice.reducer;
