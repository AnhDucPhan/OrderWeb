import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './features/ui/uiSlice';
import cartReducer from './features/cartSlice';
import { userApi } from '@/services/userApi';
import { scheduleApi } from '@/services/scheduleApi';
import { notificationApi } from '@/services/notificationApi';


// Tạo store
export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      cart: cartReducer,
      [userApi.reducerPath]: userApi.reducer,
      [scheduleApi.reducerPath]: scheduleApi.reducer,
      [notificationApi.reducerPath]: notificationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(userApi.middleware)
        .concat(scheduleApi.middleware)
        .concat(notificationApi.middleware),
  });
};

// Export các kiểu dữ liệu để dùng với TypeScript
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];