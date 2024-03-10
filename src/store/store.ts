import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "../services/auth.service";

export const store = configureStore({
  reducer: { 
    [loginSlice.reducerPath]: loginSlice.reducer 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loginSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;