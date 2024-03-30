import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

type ProfilePhotoProps = {
  value: string;
  name: string;
};

const initialState: ProfilePhotoProps = {
  value: "profile_images/default.png",
  name: "",
};

export const profilePhotoSlice = createSlice({
  name: "profilePhoto",
  initialState,
  reducers: {
    deleteProfilePhoto: (state) => {
      state.value = "";
    },
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { deleteProfilePhoto, setValue } = profilePhotoSlice.actions;

export const selectProfilePhotoValue = (state: RootState) =>
  state.profilePhotoReducer.value;

export default profilePhotoSlice.reducer;