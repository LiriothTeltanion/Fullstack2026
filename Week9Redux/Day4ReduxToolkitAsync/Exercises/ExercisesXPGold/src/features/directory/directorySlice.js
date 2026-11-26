import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "https://jsonplaceholder.typicode.com";

async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Server answered ${response.status}`);
  return response.json();
}

export const fetchUsers = createAsyncThunk(
  "directory/fetchUsers",
  (_, { signal }) => getJson(`${API_URL}/users`, signal),
  {
    // Read the live store so two effects cannot start the same initial request.
    condition: (_, { getState }) => {
      const { usersStatus } = getState().directory;
      return usersStatus === "idle" || usersStatus === "failed";
    },
  }
);

export const fetchPostsByUser = createAsyncThunk(
  "directory/fetchPostsByUser",
  // thunkAPI.signal is aborted when the component calls promise.abort()
  (userId, { signal }) => getJson(`${API_URL}/posts?userId=${userId}`, signal),
  {
    // Cache: skip the request when this user's posts are already loaded.
    condition: (userId, { getState }) =>
      getState().directory.postsByUser[userId]?.status !== "succeeded",
  }
);

const directorySlice = createSlice({
  name: "directory",
  initialState: {
    users: [],
    usersStatus: "idle",
    selectedUserId: null,
    postsByUser: {}, // { [userId]: { status, items, error } }
  },
  reducers: {
    userSelected(state, action) {
      state.selectedUserId = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.usersStatus = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersStatus = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, state => {
        state.usersStatus = "failed";
      })
      .addCase(fetchPostsByUser.pending, (state, action) => {
        // action.meta.arg is the userId the thunk was called with
        const { arg, requestId } = action.meta;
        state.postsByUser[arg] = { status: "loading", items: [], error: null, requestId };
      })
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        const { arg, requestId } = action.meta;
        if (state.postsByUser[arg]?.requestId !== requestId) return; // an older request
        state.postsByUser[arg] = {
          status: "succeeded",
          items: action.payload,
          error: null,
          requestId,
        };
      })
      .addCase(fetchPostsByUser.rejected, (state, action) => {
        const { arg, requestId, aborted } = action.meta;
        if (state.postsByUser[arg]?.requestId !== requestId) return; // an older request
        if (aborted) {
          delete state.postsByUser[arg]; // cancelled, so it can be requested again
          return;
        }
        state.postsByUser[arg] = {
          status: "failed",
          items: [],
          error: action.error.message,
          requestId,
        };
      });
  },
});

export const { userSelected } = directorySlice.actions;
export default directorySlice.reducer;

export const selectSelectedEntry = state => {
  const id = state.directory.selectedUserId;
  return id === null ? null : state.directory.postsByUser[id];
};
