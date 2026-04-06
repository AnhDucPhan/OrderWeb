import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

// 1. Định nghĩa kiểu dữ liệu (Interfaces) trả về từ Backend
export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number; // Đi kèm theo cấu hình include: { _count: { select: { products: true } } } ở Backend
  };
}

// Kiểu dữ liệu khi gửi lên để Tạo mới
export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

// Kiểu dữ liệu khi gửi lên để Cập nhật
export interface UpdateCategoryPayload {
  id: number;
  data: Partial<CreateCategoryPayload>;
}

// 2. Khởi tạo API Slice
export const productCategoryApi = createApi({
  reducerPath: 'productCategoryApi',
  baseQuery: fetchBaseQuery({
    // Đặt URL Backend của bạn ở đây (Thường lấy từ biến môi trường .env)
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', 
    
    prepareHeaders: async (headers) => {
          const session: any = await getSession();
          if (session?.accessToken) {
            headers.set('Authorization', `Bearer ${session.accessToken}`);
          }
          return headers;
        },
  }),
  
  // Khai báo Tag để quản lý Cache. Khi Tag này bị "invalidate", RTK Query sẽ tự động gọi lại API GET
  tagTypes: ['ProductCategory'],

  // 3. Định nghĩa các Endpoints (GET, POST, PATCH, DELETE)
  endpoints: (builder) => ({
    
    // Lấy danh sách tất cả Nhóm món (GET /product-category)
    getProductCategories: builder.query<ProductCategory[], void>({
      query: () => '/product-category',
      providesTags: ['ProductCategory'], // Đánh dấu dữ liệu này bằng Tag
    }),

    // Lấy chi tiết 1 Nhóm món (GET /product-category/:id)
    getProductCategoryById: builder.query<ProductCategory, number>({
      query: (id) => `/product-category/${id}`,
      providesTags: (result, error, id) => [{ type: 'ProductCategory', id }],
    }),

    // Tạo mới Nhóm món (POST /product-category)
    createProductCategory: builder.mutation<ProductCategory, CreateCategoryPayload>({
      query: (body) => ({
        url: '/product-category',
        method: 'POST',
        body,
      }),
      // Sau khi tạo xong, báo cho RTK Query biết dữ liệu cũ đã "hết hạn", hãy gọi lại API lấy danh sách mới
      invalidatesTags: ['ProductCategory'], 
    }),

    // Cập nhật Nhóm món (PATCH /product-category/:id)
    updateProductCategory: builder.mutation<ProductCategory, UpdateCategoryPayload>({
      query: ({ id, data }) => ({
        url: `/product-category/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ProductCategory'],
    }),

    // Xóa Nhóm món (DELETE /product-category/:id)
    deleteProductCategory: builder.mutation<any, number>({
      query: (id) => ({
        url: `/product-category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductCategory'],
    }),
  }),
});

// 4. Export các Hooks tự động sinh ra bởi RTK Query để dùng bên UI
export const {
  useGetProductCategoriesQuery,
  useGetProductCategoryByIdQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = productCategoryApi;