import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "loading";
  error: string;
}
const pause = () => new Promise(resolve => setTimeout(resolve, 150));
export const login = createAsyncThunk("auth/login", async (email: string) => {
  await pause();
  if (email.trim().toLowerCase() !== "demo@example.test")
    throw new Error("Use the fictional demo@example.test account.");
  return {
    id: "practice-user",
    name: "Practice Developer",
    email: "demo@example.test",
    bio: "Learning TypeScript, one small step at a time.",
  } satisfies User;
});
export const logout = createAsyncThunk("auth/logout", async () => {
  await pause();
});
export const updateProfile = createAsyncThunk("auth/updateProfile", async (user: User) => {
  await pause();
  if (
    !user.name.trim() ||
    !user.email.endsWith(".test") ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) ||
    user.name.length > 80 ||
    user.bio.length > 300
  )
    throw new Error("Enter a name and a fictional .test email.");
  return {
    ...user,
    name: user.name.trim(),
    email: user.email.trim().toLowerCase(),
    bio: user.bio.trim(),
  };
});
const initialState: AuthState = { user: null, isAuthenticated: false, status: "idle", error: "" };
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, s => {
        s.status = "loading";
        s.error = "";
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = "idle";
        s.user = a.payload;
        s.isAuthenticated = true;
      })
      .addCase(login.rejected, (s, a) => {
        s.status = "idle";
        s.error = a.error.message || "Login failed.";
      })
      .addCase(logout.pending, s => {
        s.status = "loading";
        s.error = "";
      })
      .addCase(logout.fulfilled, s => {
        s.status = "idle";
        s.user = null;
        s.isAuthenticated = false;
      })
      .addCase(updateProfile.pending, s => {
        s.status = "loading";
        s.error = "";
      })
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.status = "idle";
        if (s.isAuthenticated && s.user?.id === a.payload.id) s.user = a.payload;
      })
      .addCase(updateProfile.rejected, (s, a) => {
        s.status = "idle";
        s.error = a.error.message || "Profile update failed.";
      });
  },
});
export default authSlice.reducer;
