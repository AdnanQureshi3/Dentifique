import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
  },
  reducers: {
    setNotification: (state, action) => {
      if (action.payload.type === "Liked" || action.payload.type === "commented" || action.payload.type === "followed") {
        state.notifications.push(action.payload);
      } else if (action.payload.type === "Unliked") {
        state.notifications = state.notifications.filter(
          item =>
            !(
              item.user._id === action.payload.user._id &&
              item.postId === action.payload.postId
            )
        );
      }
      else if (action.payload.type === "Unfollowed") {
        state.notifications = state.notifications.filter(
          item =>
            !(
              item.user._id === action.payload.user._id &&
              item.receiver === action.payload.receiver &&
              item.type === "followed"
            )
        );


      }
    },
    setNotificationArray: (state, action) => {
      state.notifications = action.payload;
    }
    ,

    clearNotification: (state) => {
      state.notifications = [];
    }
  }
});

export const { setNotification, clearNotification, setNotificationArray, } = notificationSlice.actions;
export default notificationSlice.reducer;
