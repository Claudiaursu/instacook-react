import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "../services/auth.service";
import userSlice from "./tokenSlice";
import { userInteractionSlice } from "../services/user-interaction.service";
import profilePhotoReducer from "./profilePhoto.slice";
import { collectionSlice } from "../services/collection.service";
import { recipeSlice } from "../services/recipe.service";
import { userFollowingSlice } from "../services/following.service";

export const store = configureStore({
  reducer: { 
    [loginSlice.reducerPath]: loginSlice.reducer,
    [userInteractionSlice.reducerPath]: userInteractionSlice.reducer,
    [userFollowingSlice.reducerPath]: userFollowingSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [collectionSlice.reducerPath]: collectionSlice.reducer,
    [recipeSlice.reducerPath]: recipeSlice.reducer,
    profilePhotoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(loginSlice.middleware)
    .concat(userInteractionSlice.middleware)
    .concat(collectionSlice.middleware)
    .concat(recipeSlice.middleware)
    .concat(userFollowingSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;