// src/redux/services/userApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSession } from 'next-auth/react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  avatar?: string;
  createdAt: string;
  status: string;
  position: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8386',
    prepareHeaders: async (headers) => {
      const session: any = await getSession();
      const token = session?.accessToken;
      console.log("TEST SESSION:", session);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);

      }
      return headers
    },
  }),

  tagTypes: ['Users'],

  endpoints: (builder) => ({

    // Thêm role và status vào type định nghĩa
    getUsers: builder.query<{ data: User[]; meta: any }, { page: number; perPage: number; q?: string; role?: string; status?: string }>({
      query: ({ page, perPage, q, role, status }) => {
        // 1. Kiểm tra xem có gõ tìm kiếm không để quyết định gọi endpoint nào
        let url = q
          ? `/users/search?page=${page}&perPage=${perPage}&q=${encodeURIComponent(q)}`
          : `/users?page=${page}&perPage=${perPage}`;

        // 2. Nối thêm bộ lọc nếu có
        if (role && role !== 'all') url += `&role=${encodeURIComponent(role)}`;
        if (status && status !== 'all') url += `&status=${encodeURIComponent(status)}`;

        return url;
      },
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Users' as const, id })), 'Users']
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