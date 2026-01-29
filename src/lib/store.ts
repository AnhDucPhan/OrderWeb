import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import uiReducer from './features/ui/uiSlice';

// Tạo store
export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      ui: uiReducer,
      // sau này có thêm user, cart thì thêm vào đây
      // user: userReducer,
    },
  });
};

// Export các kiểu dữ liệu để dùng với TypeScript
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];