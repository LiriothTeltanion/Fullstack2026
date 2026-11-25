import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/api";

export interface DataEntry {
  data: unknown;
  loading: boolean;
  hasData: boolean;
  error: string | null;
  requestId: string | null;
}

export interface DataSliceState {
  byUrl: Record<string, DataEntry | undefined>;
}

const initialState: DataSliceState = { byUrl: {} };

export const loadData = createAsyncThunk("data/load", (url: string, { signal }) =>
  fetchData<unknown>(url, signal)
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadData.pending, (state, action) => {
        state.byUrl[action.meta.arg] = {
          data: null,
          loading: true,
          hasData: false,
          error: null,
          requestId: action.meta.requestId,
        };
      })
      .addCase(loadData.fulfilled, (state, action) => {
        const entry = state.byUrl[action.meta.arg];
        if (!entry || entry.requestId !== action.meta.requestId) return;
        entry.data = action.payload;
        entry.hasData = true;
        entry.loading = false;
        entry.requestId = null;
      })
      .addCase(loadData.rejected, (state, action) => {
        const entry = state.byUrl[action.meta.arg];
        if (!entry || entry.requestId !== action.meta.requestId) return;
        entry.loading = false;
        entry.requestId = null;
        entry.error = action.meta.aborted ? null : (action.error.message ?? "Unknown error");
      });
  },
});

export default dataSlice.reducer;
