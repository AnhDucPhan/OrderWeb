import { createSlice } from '@reduxjs/toolkit';

// 1. Khởi tạo giá trị mặc định
const initialState = {
  value: 0,
};

// 2. Tạo Slice
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // Các hành động (Actions) có thể làm
    increment: (state) => {
      state.value += 1; // Redux Toolkit cho phép viết kiểu thay đổi trực tiếp này
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// 3. Xuất ra các Actions để Component dùng
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 4. Xuất Reducer để nạp vào Store
export default counterSlice.reducer;