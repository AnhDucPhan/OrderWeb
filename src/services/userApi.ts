// src/redux/services/userApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Định nghĩa kiểu User (như cũ)
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const userApi = createApi({
  reducerPath: 'userApi', // Tên định danh trong Store
  
  // 1. Cấu hình Base URL và Headers
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8386',
    prepareHeaders: (headers) => {
      // Nếu có token thì nhét vào đây tự động
      // const token = localStorage.getItem('token')
      // if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),

  // 2. QUAN TRỌNG: Định nghĩa các Nhãn (Tag) để quản lý Cache
  tagTypes: ['Users'], 

  endpoints: (builder) => ({
    
    // A. Lấy danh sách (Query)
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      // 👇 Dán nhãn "Users" vào dữ liệu trả về
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }) => ({ type: 'Users' as const, id })), 'Users'] 
          : ['Users'],
    }),

    // B. Thêm mới (Mutation)
    createUser: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: '/users',
        method: 'POST',
        body: formData, // Tự động xử lý FormData
      }),
      // 👇 QUAN TRỌNG NHẤT: Báo hiệu nhãn "Users" đã bị cũ, cần tải lại ngay!
      invalidatesTags: ['Users'], 
    }),
  }),
})

// 3. Tự động sinh ra Hooks để dùng trong Component
export const { useGetUsersQuery, useCreateUserMutation } = userApi