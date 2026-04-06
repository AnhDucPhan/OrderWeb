import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 1. Định nghĩa kiểu dữ liệu Món ăn (Product) trả về từ Backend
export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    thumbnail?: string; // URL ảnh (đã được BE up lên Cloudinary và trả về)
    isActive: boolean;
    productCategoryId: number;
    createdAt: string;
    // Có thể có thêm trường productCategory nếu BE có include
    productCategory?: {
        id: number;
        name: string;
    };
}

// Kiểu dữ liệu phân trang
export interface ProductResponse {
    data: Product[];
    meta: {
        total: number;
        lastPage: number;
        currentPage: number;
        perPage: number;
        prev: number | null;
        next: number | null;
    };
}

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({

        // 1. ENDPOINT: GET /products (Khớp với findAll trong Controller)
        getProducts: builder.query<ProductResponse, Record<string, any>>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    Object.keys(params).forEach(key => {
                        if (params[key] !== undefined && params[key] !== null) {
                            queryParams.append(key, String(params[key]));
                        }
                    });
                }
                return `/products?${queryParams.toString()}`;
            },
            providesTags: ['Product'],
        }),

        // 👇 THÊM ENDPOINT LẤY 1 SẢN PHẨM THEO ID (Khớp với findOne trong Controller)
        getOneProduct: builder.query<Product, number>({
            query: (id) => `/products/${id}`,
            providesTags: ['Product'], 
            // Nếu BE của bạn bọc data trả về trong object { data: {...} } 
            // thì hãy đổi kiểu trả về thành `any` hoặc dùng transformResponse nhé.
        }),

        // 2. ENDPOINT: POST /products (Khớp với create trong Controller)
        createProduct: builder.mutation<Product, FormData>({
            query: (formData) => ({
                url: '/products',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Product'],
        }),

        updateProduct: builder.mutation<Product, { id: number; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),

        deleteProduct: builder.mutation<any, number>({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetOneProductQuery, // 👈 Export hook để dùng ở component
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productApi;