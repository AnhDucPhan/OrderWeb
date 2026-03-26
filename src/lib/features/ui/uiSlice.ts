import { createSlice } from '@reduxjs/toolkit';

// 1. Khai báo kiểu dữ liệu cho toàn bộ UI State
interface UiState {
  isProfileOpen: boolean;
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
}

// 2. Khởi tạo giá trị mặc định (Tất cả đều đóng)
const initialState: UiState = {
  isProfileOpen: false,
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ========================================
    // A. QUẢN LÝ PROFILE
    // ========================================
    openProfile: (state) => {
      state.isProfileOpen = true;
      // Đảm bảo đóng các form xác thực nếu đang mở
      state.isLoginModalOpen = false; 
      state.isRegisterModalOpen = false;
    },
    closeProfile: (state) => {
      state.isProfileOpen = false;
    },

    // ========================================
    // B. QUẢN LÝ LOGIN MODAL
    // ========================================
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
      // Đóng form đăng ký và profile
      state.isRegisterModalOpen = false; 
      state.isProfileOpen = false;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },

    // ========================================
    // C. QUẢN LÝ REGISTER MODAL
    // ========================================
    openRegisterModal: (state) => {
      state.isRegisterModalOpen = true;
      // Đóng form đăng nhập và profile
      state.isLoginModalOpen = false; 
      state.isProfileOpen = false;
    },
    closeRegisterModal: (state) => {
      state.isRegisterModalOpen = false;
    },

    // ========================================
    // D. NÚT ĐÓNG KHẨN CẤP TẤT CẢ (Dùng cho Overlay)
    // ========================================
    closeAllAuthModals: (state) => {
      state.isLoginModalOpen = false;
      state.isRegisterModalOpen = false;
      // Tuỳ chọn: Có thể thêm state.isProfileOpen = false vào đây nếu muốn click ra ngoài là đóng cả profile
    }
  },
});

// 3. Export các actions để Component sử dụng (`dispatch(openLoginModal())`)
export const { 
  openProfile, 
  closeProfile, 
  openLoginModal, 
  closeLoginModal, 
  openRegisterModal, 
  closeRegisterModal, 
  closeAllAuthModals 
} = uiSlice.actions;

// 4. Export reducer để gắn vào file store.ts
export default uiSlice.reducer;