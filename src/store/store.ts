import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "../services/auth.service";
import { userTokenReducer } from "./reducers";
import userSlice from "./tokenSlice";

export const store = configureStore({
  reducer: { 
    [loginSlice.reducerPath]: loginSlice.reducer,
    userData: userSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loginSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;