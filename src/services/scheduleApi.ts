
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { se } from 'date-fns/locale';
import { getSession } from 'next-auth/react';

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8386',
    prepareHeaders:async (headers) => {
      // Nhớ cấu hình lấy Token giống bên userApi nhé!
      const session: any = await getSession();
      const token = session?.accessToken; 
      if (token) {
        // 2. Cắt bỏ dấu ngoặc kép thừa (nếu có)
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Schedules'],
  endpoints: (builder) => ({
    // Gọi API thêm lịch mới
    createSchedule: builder.mutation<any, { userId: number; startTime: string; endTime: string; note?: string }>({
      query: (body) => ({
        url: '/schedule',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Schedules'], // Báo hiệu làm mới danh sách lịch
    }),
  }),
})

export const { useCreateScheduleMutation } = scheduleApi