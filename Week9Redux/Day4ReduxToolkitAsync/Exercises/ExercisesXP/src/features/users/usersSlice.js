import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL } from "../../app/api.js";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error(`Server answered ${response.status}`);
  return response.json();
});

const usersSlice = createSlice({
  name: "users",
  initialState: { items: [], status: "idle" },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, state => {
        state.status = "failed";
      });
  },
});

export const selectUserName = (state, userId) =>
  state.users.items.find(user => user.id === userId)?.name ?? "Unknown author";
export default usersSlice.reducer;
