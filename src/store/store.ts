import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "../services/auth.service";
import { userTokenReducer } from "./reducers";
import userSlice from "./tokenSlice";
import { userInteractionSlice } from "../services/user-interaction.service";
import profilePhotoReducer from "./profilePhoto.slice";
import { collectionSlice } from "../services/collection.service";

export const store = configureStore({
  reducer: { 
    [loginSlice.reducerPath]: loginSlice.reducer,
    [userInteractionSlice.reducerPath]: userInteractionSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [collectionSlice.reducerPath]: collectionSlice.reducer,
    profilePhotoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(loginSlice.middleware)
    .concat(userInteractionSlice.middleware)
    .concat(collectionSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;