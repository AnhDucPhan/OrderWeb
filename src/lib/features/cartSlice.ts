import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';

// Kiểu dữ liệu cho 1 món trong giỏ
export interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    thumbnail: string;
  }
}

interface CartState {
  items: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
};

// 1. Thunk gọi API Add to Cart
export const addToCartAPI = createAsyncThunk(
  'cart/addToCartAPI',
  async (payload: { productId: number, quantity: number }, { rejectWithValue }) => {
    try {
      const session = await getSession();
      console.log("Session Token:", session?.accessToken);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      return data; // Trả về cartItem vừa thêm/update
    } catch (error) {
      return rejectWithValue('Lỗi thêm giỏ hàng');
    }
  }
);

export const getCartAPI = createAsyncThunk(
  'cart/getCartAPI',
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      const token = session?.accessToken;
      if (!token) return { items: [] };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // 👇 Gửi Token đi
          },
        }
      );
      if (!res.ok) throw new Error('Lỗi lấy giỏ hàng');
      return await res.json();
    } catch (error) {
      return rejectWithValue('Lỗi lấy giỏ hàng');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Các action đồng bộ nếu cần (ví dụ xóa cart local)
  },
  extraReducers: (builder) => {
    builder.addCase(addToCartAPI.fulfilled, (state, action) => {
      // Logic cập nhật state:
      // Cách đơn giản nhất: Tìm item trong list, nếu có thì update, chưa có thì push
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(i => i.product.id === newItem.product.id);

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity = newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    });
    builder.addCase(getCartAPI.fulfilled, (state, action) => {
      // action.payload là object Cart từ DB, ta lấy mảng items bên trong
      if (action.payload && action.payload.items) {
        state.items = action.payload.items;
      } else {
        state.items = [];
      }
    });
  },
});





export default cartSlice.reducer;