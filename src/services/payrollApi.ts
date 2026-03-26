
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

export const payrollApi = createApi({
  reducerPath: 'payrollApi',
  baseQuery: fetchBaseQuery({
    // 👇 Ưu tiên lấy biến môi trường, nếu không có mới dùng localhost
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8386',
    prepareHeaders: async (headers) => {
      const session: any = await getSession();
      if (session?.accessToken) {
        headers.set('authorization', `Bearer ${session.accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Payroll'], // Đánh tag để tự động refetch
  endpoints: (builder) => ({

    // 1. Lấy danh sách duyệt công theo khoảng thời gian
    getPayrollSchedules: builder.query<any[], { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => `/payroll?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Payroll'],
    }),

    // 2. Chốt công (Duyệt hoặc Từ chối)
    reviewPayroll: builder.mutation<any, {
      id: number;
      decision: 'APPROVE' | 'REJECT';
      standardMinutes: number;
      otMinutes: number
    }>({
      query: ({ id, ...body }) => ({
        url: `/payroll/${id}/review`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Payroll'], // Bấm duyệt xong tự load lại bảng
    }),

  }),
});

export const { useGetPayrollSchedulesQuery, useReviewPayrollMutation } = payrollApi;