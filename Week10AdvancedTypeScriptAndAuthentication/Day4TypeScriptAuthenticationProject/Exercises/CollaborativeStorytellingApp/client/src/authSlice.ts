import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";

const initialState: { user: User | null; accessToken: string | null; checking: boolean } = {
  user: null,
  accessToken: null,
  checking: true,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionChanged(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      if (!action.payload) state.accessToken = null;
    },
    accessTokenChanged(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    sessionChecked(state) {
      state.checking = false;
    },
  },
});
export const { sessionChanged, accessTokenChanged, sessionChecked } = authSlice.actions;
export default authSlice.reducer;
