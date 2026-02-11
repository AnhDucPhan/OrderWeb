import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './features/ui/uiSlice';
import cartReducer from './features/cartSlice';
import userReducer from './features/userSlice';
import { userApi } from '@/services/userApi';


// Tạo store
export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      cart: cartReducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware),
  });
};

// Export các kiểu dữ liệu để dùng với TypeScript
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];