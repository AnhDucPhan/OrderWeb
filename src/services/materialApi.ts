import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

// 1. Định nghĩa kiểu dữ liệu khớp 100% với Database
export interface Material {
  id: number;
  name: string;
  unit: string;
  stock: number;
  isActive: boolean;
  categoryId: number; // 👈 Thêm cái này
  category?: {        // 👈 Thêm cái này để lấy tên hiển thị ra bảng
    id: number;
    name: string;
  };
}

export const materialApi = createApi({
  reducerPath: 'materialApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8386',
    prepareHeaders: async (headers) => {
      const session: any = await getSession();
      const token = session?.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  // Đặt nhãn để RTK Query biết khi nào cần load lại bảng
  tagTypes: ['Materials'],

  endpoints: (builder) => ({

    getMaterials: builder.query<{ data: Material[]; meta: any }, { page: number; perPage: number; q?: string; categoryId?: string; status?: string }>({
      
      query: ({ page, perPage, q, categoryId, status }) => {
        let url = `/materials?page=${page}&perPage=${perPage}`;

        if (q) url += `&q=${encodeURIComponent(q)}`;
        // Bây giờ nó đã hiểu categoryId là cái gì rồi!
        if (categoryId && categoryId !== 'all') url += `&categoryId=${encodeURIComponent(categoryId)}`;
        if (status && status !== 'all') url += `&status=${encodeURIComponent(status)}`;

        return url;
      },
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Materials' as const, id })), 'Materials']
          : ['Materials'],
    }),

    // B. LẤY CHI TIẾT 1 MÓN (Dành cho form sửa)
    getMaterialById: builder.query<Material, number>({
      query: (id) => `/materials/${id}`,
      providesTags: (result, error, id) => [{ type: 'Materials', id }],
    }),

    // C. THÊM MỚI
    createMaterial: builder.mutation<Material, Partial<Material>>({
      query: (body) => ({
        url: '/materials',
        method: 'POST',
        body, // Tự động parse thành JSON
      }),
      invalidatesTags: ['Materials'], // Thêm xong thì báo bảng load lại
    }),

    // D. CẬP NHẬT
    updateMaterial: builder.mutation<Material, { id: number; data: Partial<Material> }>({
      query: ({ id, data }) => ({
        url: `/materials/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Materials'], // Cập nhật xong thì báo bảng load lại
    }),

    // E. XÓA
    deleteMaterial: builder.mutation<void, number>({
      query: (id) => ({
        url: `/materials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Materials'], // Xóa xong thì báo bảng load lại
    }),
  }),
});

// Tự động sinh ra Hooks để dùng trong UI Component
export const {
  useGetMaterialsQuery,
  useGetMaterialByIdQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} = materialApi;