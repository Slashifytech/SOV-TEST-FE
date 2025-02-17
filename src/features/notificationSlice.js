import { createSlice } from "@reduxjs/toolkit";
import { store } from "./store";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    notificationCount: 0,
    currentPage: 0,
    nextPage: 0,
    totalPage: 0,
    totalNotification: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n._id !== action.payload
      );
    },
    removeAllNotification: (state) => {
      state.notifications = [];
    },
    markNotificationAsRead: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );
    },
    addAllNotifications: (state, action) => {
      const {
        notifications,
        currentPage,
        nextPage,
        totalPages,
        totalNotifications,
      } = action.payload;
      const uniqueNotifications = notifications.filter(
        (newNotification) =>
          !state.notifications.some(
            (existingNotification) =>
              existingNotification._id === newNotification._id
          )
      );
      state.currentPage = currentPage || 1;
      state.nextPage = nextPage || 1;
      state.totalPage = totalPages || 1;
      state.totalNotification = totalNotifications || 1;

      state.notifications = [...state.notifications, ...uniqueNotifications];
    },
    updateNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
    addOneCountToNotification: (state) => {
      state.notificationCount += 1;
    },
    clearNotificationCount: (state) => {
      state.notificationCount = 0;
    },
    addNewNotification: (state, action) => {
      
    const roleType =  store.getState().admin.getAdminProfile.data.role;
     const country =   store.getState().admin.getAdminProfile.data?.residenceAddress?.country;
     const province = store.getState().admin.getAdminProfile.data?.residenceAddress?.state;
      const notification = action.payload;
   if(notification?.country !== country && notification.state !== province && (roleType === "4" || roleType === "5")){
   return 
   }
      const isDuplicate = state.notifications.some(
        (existingNotification) => existingNotification._id === notification._id
      );
      if (!isDuplicate) {
        state.notifications = [notification, ...state.notifications];
      }
    },
    markAllAsSeen: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
    },
  },
});

export const {
  markNotificationAsRead,
  addAllNotifications,
  updateNotificationCount,
  addOneCountToNotification,
  clearNotificationCount,
  addNewNotification,
  removeNotification,
  markAllAsSeen,
  removeAllNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
