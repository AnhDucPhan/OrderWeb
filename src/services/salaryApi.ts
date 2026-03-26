import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

export const salaryApi = createApi({
  reducerPath: 'salaryApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8386',
    prepareHeaders: async (headers) => {
      const session: any = await getSession();
      if (session?.accessToken) {
        headers.set('authorization', `Bearer ${session.accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Salary'],
  endpoints: (builder) => ({
    // Lấy bảng lương tháng
    getMonthlySalary: builder.query<any, string>({
      query: (month) => `/salary/monthly?month=${month}`,
      providesTags: ['Salary'],
    }),
    
    // Trả lương
    paySalary: builder.mutation<any, { userId: number; month: string }>({
      query: (body) => ({
        url: `/salary/pay`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Salary'], 
    }),
  }),
});

export const { useGetMonthlySalaryQuery, usePaySalaryMutation } = salaryApi;