import { configureStore } from "@reduxjs/toolkit";
import storyReducer, { accessTokenChanged } from "./storySlice";
import { configureAccessToken } from "./api";

export const store = configureStore({ reducer: { story: storyReducer } });
configureAccessToken(
  () => store.getState().story.accessToken,
  token => {
    store.dispatch(accessTokenChanged(token));
  }
);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
