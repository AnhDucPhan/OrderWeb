import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Lỗi từ server');
      return await res.json();
    } catch (error) {
      return rejectWithValue('Lỗi thêm giỏ hàng');
    }
  }
);

// 2. Thunk gọi API Lấy Giỏ Hàng
export const getCartAPI = createAsyncThunk(
  'cart/getCartAPI',
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      const token = session?.accessToken;
      if (!token) return { items: [] };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error('Lỗi từ server');
      return await res.json();
    } catch (error) {
      return rejectWithValue('Lỗi lấy giỏ hàng');
    }
  }
);

// 3. Thunk gọi API Xóa Sản Phẩm
export const removeCartItemAPI = createAsyncThunk(
  'cart/removeCartItemAPI',
  async (itemId: number, { rejectWithValue }) => {
    try {
      const session = await getSession();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/item/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        },
      });
      if (!res.ok) throw new Error('Lỗi từ server');
      return itemId;
    } catch (error) {
      return rejectWithValue('Lỗi xóa sản phẩm');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Lưu ý: Hàm này hiện tại chỉ update giao diện tạm thời. 
    // Nên kết hợp gọi API debounce ở component để lưu xuống DB.
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
  extraReducers: (builder) => {
    // --- XỬ LÝ GET CART ---
    builder.addCase(getCartAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCartAPI.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload?.items || [];
    });
    builder.addCase(getCartAPI.rejected, (state) => {
      state.loading = false;
      state.items = []; // Có thể văng lỗi thì cho rỗng luôn
    });

    // --- XỬ LÝ ADD TO CART ---
    builder.addCase(addToCartAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addToCartAPI.fulfilled, (state, action) => {
      state.loading = false;
      const newItem = action.payload;
      const existingItem = state.items.find(i => i.product.id === newItem.product.id);

      if (existingItem) {
        existingItem.quantity = newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    });
    builder.addCase(addToCartAPI.rejected, (state) => {
      state.loading = false;
    });

    // --- XỬ LÝ REMOVE ITEM ---
    builder.addCase(removeCartItemAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeCartItemAPI.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
    builder.addCase(removeCartItemAPI.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;