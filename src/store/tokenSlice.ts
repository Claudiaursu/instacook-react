import { PayloadAction, createSlice } from "@reduxjs/toolkit";
 
interface UserState {
 token: string;
 username: string;
}
 
const initialState: UserState = { 
  token: "",
  username: ""
};
 
const userSlice = createSlice({
 name: "userData", //the way it will look in the store
 initialState,
 reducers: {
   // we define the logic we are going to have in this reducer
   updateToken(state, action: PayloadAction<string>) {
    state.token = action.payload;
  },
  updateUsername(state, action: PayloadAction<string>) {
    state.username = action.payload;
  },
 },
});
 
export const { updateToken, updateUsername } = userSlice.actions;
export default userSlice;