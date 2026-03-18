import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store'; // Đổi tên file cho khớp nếu store của bạn tên khác

// Sử dụng các hook này trong toàn bộ App thay vì useDispatch và useSelector mặc định
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;