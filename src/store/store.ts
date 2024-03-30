import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "../services/auth.service";
import { userTokenReducer } from "./reducers";
import userSlice from "./tokenSlice";
import { userInteractionSlice } from "../services/user-interaction.service";
import profilePhotoReducer from "./profilePhoto.slice";

export const store = configureStore({
  reducer: { 
    [loginSlice.reducerPath]: loginSlice.reducer,
    [userInteractionSlice.reducerPath]: userInteractionSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    profilePhotoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(loginSlice.middleware)
    .concat(userInteractionSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;