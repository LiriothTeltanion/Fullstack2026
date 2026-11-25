import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "./api";
import type { Story, User } from "./types";

interface StoryState {
  user: User | null;
  accessToken: string | null;
  checking: boolean;
  stories: Story[];
  loading: boolean;
  error: string;
  requestId: string | null;
}
const initialState: StoryState = {
  user: null,
  accessToken: null,
  checking: true,
  stories: [],
  loading: false,
  error: "",
  requestId: null,
};

export const fetchStories = createAsyncThunk(
  "story/fetch",
  async () => (await api.stories()).stories,
  { condition: (_, { getState }) => Boolean((getState() as { story: StoryState }).story.user) }
);

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    sessionChanged(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      if (!action.payload) state.accessToken = null;
      state.stories = [];
      state.error = "";
      state.loading = false;
      state.requestId = null;
    },
    accessTokenChanged(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    sessionChecked(state) {
      state.checking = false;
    },
    errorChanged(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStories.pending, (state, action) => {
        state.loading = true;
        state.error = "";
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        if (!state.user || state.requestId !== action.meta.requestId) return;
        state.stories = action.payload;
        state.loading = false;
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
export const { sessionChanged, sessionChecked, errorChanged, accessTokenChanged } =
  storySlice.actions;
export default storySlice.reducer;
