import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const usersAdapter = createEntityAdapter();

// Normalized shape: { ids: ["u1", ...], entities: { u1: { id, name }, ... } }
const initialState = usersAdapter.setAll(usersAdapter.getInitialState(), [
  { id: "u1", name: "Noa" },
  { id: "u2", name: "Daniel" },
  { id: "u3", name: "Maya" },
]);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userRemoved: usersAdapter.removeOne,
  },
});

export const { userRemoved } = usersSlice.actions;
export default usersSlice.reducer;

export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(
  state => state.users
);
