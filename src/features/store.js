
import stepperReducer from "./Regslice";
import studentReducer from "./studentSlice";
import generalReducer from "./generalSlice";
import authReducer from "./authSlice";
import agentReducer from "./agentSlice"
import adminReducer from "./adminSlice";
import notificationsReducer from "./notificationSlice"
import { configureStore } from "@reduxjs/toolkit";



export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    student: studentReducer,
    general: generalReducer,
    auth: authReducer,
    agent: agentReducer,
    admin: adminReducer,
    notifications: notificationsReducer,
  },

  //   middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  // middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), userIdMiddleware],
});
