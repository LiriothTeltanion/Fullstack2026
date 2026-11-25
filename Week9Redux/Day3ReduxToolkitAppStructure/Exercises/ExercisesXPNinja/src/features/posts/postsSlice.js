import { createEntityAdapter, createSelector, createSlice, nanoid } from "@reduxjs/toolkit";
import { userRemoved } from "../users/usersSlice.js";

// Newest posts first.
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = postsAdapter.setAll(postsAdapter.getInitialState(), [
  {
    id: "p1",
    userId: "u1",
    text: "Finished the Redux reading.",
    createdAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "p2",
    userId: "u2",
    text: "Entity adapters save so much code.",
    createdAt: "2026-01-10T10:30:00.000Z",
  },
  {
    id: "p3",
    userId: "u1",
    text: "Normalized state = no duplicated users.",
    createdAt: "2026-01-11T08:15:00.000Z",
  },
]);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer: postsAdapter.addOne,
      prepare(userId, text) {
        return { payload: { id: nanoid(), userId, text, createdAt: new Date().toISOString() } };
      },
    },
    postUpdated(state, action) {
      const { id, text } = action.payload;
      postsAdapter.updateOne(state, { id, changes: { text } });
    },
    postRemoved: postsAdapter.removeOne,
  },
  extraReducers: builder => {
    // When a user is removed in the users slice, their posts go too.
    builder.addCase(userRemoved, (state, action) => {
      const ids = Object.values(state.entities)
        .filter(post => post.userId === action.payload)
        .map(post => post.id);
      postsAdapter.removeMany(state, ids);
    });
  },
});

export const { postAdded, postUpdated, postRemoved } = postsSlice.actions;
export default postsSlice.reducer;

export const { selectAll: selectAllPosts } = postsAdapter.getSelectors(state => state.posts);

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => (userId === "all" ? posts : posts.filter(post => post.userId === userId))
);
