// src/redux/services/userApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Định nghĩa kiểu User (như cũ)
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  avatar?: string;
  createdAt: string;
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
    updateUser: builder.mutation<User, { id: number | string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/users/${id}`, // 👉 Gọi vào endpoint PATCH /users/:id
        method: 'PATCH',     // 👉 Dùng method PATCH
        body: formData,
      }),
      invalidatesTags: ['Users'], // 👉 Sửa xong thì báo danh sách "Users" tự load lại
    }),
    deleteUser: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      // 👇 Quan trọng: Xóa xong thì báo danh sách cũ rồi, load lại đi!
      invalidatesTags: ['Users'],
    }),

    getUserById: builder.query<User, number | string>({
      query: (id) => `/users/${id}`, // Gọi vào endpoint GET /users/:id
      
      // Dán nhãn cụ thể cho từng User ID
      // Để khi update user số 1, thì chỉ cache của user số 1 bị reload (nếu muốn tối ưu)
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
  }),
})

// 3. Tự động sinh ra Hooks để dùng trong Component
export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
 } = userApi