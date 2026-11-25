import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const DELAY_MS = 1000;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// Both thunks pretend to talk to a server: they wait one second, then return the change.
export const ageUpAsync = createAsyncThunk("age/ageUpAsync", async () => {
  await wait(DELAY_MS);
  return 1;
});

export const ageDownAsync = createAsyncThunk(
  "age/ageDownAsync",
  async () => {
    await wait(DELAY_MS);
    return -1;
  },
  {
    // `condition` runs before the thunk starts; returning false cancels it.
    condition: (_, { getState }) => getState().age.value > 0,
  }
);

const ageSlice = createSlice({
  name: "age",
  initialState: { value: 20, loading: false },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(ageUpAsync.pending, state => {
        state.loading = true;
      })
      .addCase(ageDownAsync.pending, state => {
        state.loading = true;
      })
      .addCase(ageUpAsync.fulfilled, (state, action) => {
        state.value += action.payload;
        state.loading = false;
      })
      .addCase(ageDownAsync.fulfilled, (state, action) => {
        state.value += action.payload;
        state.loading = false;
      });
  },
});

export const selectAge = state => state.age.value;
export const selectLoading = state => state.age.loading;
export default ageSlice.reducer;
