import { PayloadAction, createSlice } from "@reduxjs/toolkit";
 
interface UserState {
 unseenNotifications: number;
}
 
const initialState: UserState = { 
  unseenNotifications: 0
};
 
const notificationCountSlice = createSlice({
 name: "notificationsCount", //the way it will look in the store
 initialState,
 reducers: {
  updateunseenNotifications(state, action: PayloadAction<number>) {
    state.unseenNotifications = action.payload;
  },
 },
});
 
export const { updateunseenNotifications } = notificationCountSlice.actions;
export default notificationCountSlice;