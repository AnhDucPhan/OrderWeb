
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSession } from 'next-auth/react';


export interface Schedule {
  id: number;
  userId: number;
  startTime: string; // Dữ liệu từ API trả về là dạng chuỗi
  endTime: string;
  status: string;
  note?: string;
}
export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8386',
    prepareHeaders: async (headers) => {
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
    getSchedules: builder.query<Schedule[], { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => `/schedule?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Schedules'],
    }),
    updateSchedule: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/schedule/${id}`,
        method: 'PATCH', // Hoặc PATCH tùy thuộc vào backend của bạn
        body: data,
      }),
      invalidatesTags: ['Schedules'], // Kích hoạt tải lại dữ liệu
    }),

    deleteSchedule: builder.mutation<any, number>({
      query: (id) => ({
        url: `/schedule/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedules'], // Kích hoạt tải lại dữ liệu
    }),
  }),
})

export const { useCreateScheduleMutation, useGetSchedulesQuery, useUpdateScheduleMutation, useDeleteScheduleMutation } = scheduleApi