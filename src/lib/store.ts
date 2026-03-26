import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './features/ui/uiSlice';
import cartReducer from './features/cartSlice';
import { userApi } from '@/services/userApi';
import { scheduleApi } from '@/services/scheduleApi';
import { notificationApi } from '@/services/notificationApi';
import { attendanceApi } from '@/services/attendanceApi';
import { payrollApi } from '@/services/payrollApi';
import { salaryApi } from '@/services/salaryApi';


// Tạo store
export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      cart: cartReducer,
      [userApi.reducerPath]: userApi.reducer,
      [scheduleApi.reducerPath]: scheduleApi.reducer,
      [notificationApi.reducerPath]: notificationApi.reducer,
      [attendanceApi.reducerPath]: attendanceApi.reducer,
      [payrollApi.reducerPath]: payrollApi.reducer,
      [salaryApi.reducerPath]: salaryApi.reducer,

    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(userApi.middleware)
        .concat(scheduleApi.middleware)
        .concat(notificationApi.middleware)
        .concat(attendanceApi.middleware)
        .concat(payrollApi.middleware)
        .concat(salaryApi.middleware),
  });
};

// Export các kiểu dữ liệu để dùng với TypeScript
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];