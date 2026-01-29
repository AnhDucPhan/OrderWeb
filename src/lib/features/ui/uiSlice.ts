import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  isLoginOpen: boolean;
  isProfileOpen: boolean; // 1. Thêm cái này
}

const initialState: UiState = {
  isLoginOpen: false,
  isProfileOpen: false, // 2. Khởi tạo
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ... giữ nguyên các reducers login cũ
    openLogin: (state) => { state.isLoginOpen = true; },
    closeLogin: (state) => { state.isLoginOpen = false; },

    // 3. Thêm actions cho Profile
    openProfile: (state) => {
      state.isProfileOpen = true;
      state.isLoginOpen = false; // Đảm bảo đóng login nếu mở profile
    },
    closeProfile: (state) => {
      state.isProfileOpen = false;
    },
  },
});

export const { openLogin, closeLogin, openProfile, closeProfile } = uiSlice.actions;
export default uiSlice.reducer;