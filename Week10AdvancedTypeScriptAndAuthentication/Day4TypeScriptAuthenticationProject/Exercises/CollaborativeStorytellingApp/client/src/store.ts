import { configureStore } from "@reduxjs/toolkit";
import storyReducer from "./storySlice";
import authReducer, { accessTokenChanged, sessionChanged } from "./authSlice";
import { configureAccessToken } from "./api";

export const store = configureStore({ reducer: { auth: authReducer, story: storyReducer } });
configureAccessToken(
  () => store.getState().auth.accessToken,
  token => {
    store.dispatch(accessTokenChanged(token));
    if (token === null) store.dispatch(sessionChanged(null));
  }
);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
