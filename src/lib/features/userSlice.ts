

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from "@/services/user.service";

// 1. Định nghĩa kiểu dữ liệu User
export interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  phoneNumber?: string; // Thêm trường này nếu backend có trả về
  avatar?: string;      // Thêm trường này nếu backend có trả về  
}


interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// 2. Viết AsyncThunk gọi API
export const fetchUsersAPI = createAsyncThunk(
  'user/fetchUsersAPI',
  // Logic gọi API đã bị đẩy sang file service, ở đây chỉ gọi lại hàm đó
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const data = await userService.getAll(accessToken);
      return data; // Trả về data để Redux lưu vào state.users
    } catch (error: any) {
      // Bắt lỗi từ service ném ra
      return rejectWithValue(error.message);
    }
  }
);



const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // Gán data vào state
      })
      .addCase(fetchUsersAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;