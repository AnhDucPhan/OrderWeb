import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

// Khai báo kiểu dữ liệu trả về cho ca làm hôm nay
export interface AttendanceSchedule {
  id: number;
  userId: number;
  startTime: string;
  endTime: string;
  status: string;
  attendanceStatus: string;
  actualCheckInTime?: string;
  actualCheckOutTime?: string;
}

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8386',
    prepareHeaders: async (headers) => {
      const session: any = await getSession();
      const token = session?.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // 👇 Khai báo Tag để quản lý cache và refetch tự động
  tagTypes: ['Attendance'],
  endpoints: (builder) => ({

    // 1. Lấy ca làm hôm nay
    getTodaySchedule: builder.query<AttendanceSchedule | null, void>({
      query: () => '/attendance/today',
      providesTags: ['Attendance'], // 👈 Gắn mác cho dữ liệu này
    }),

    // 2. Chấm công vào (Check-in)
    // 👇 Thay vì để void, chúng ta khai báo nó nhận vào object { note?: string }
    checkIn: builder.mutation<any, { note?: string }>({
      query: (body) => ({
        url: '/attendance/check-in', // Sửa lại URL cho khớp với Backend của bạn
        method: 'POST',
        body: body, // 👈 Truyền cục body (chứa note) xuống Backend
      }),
      invalidatesTags: ['Attendance'],
    }),

    checkOut: builder.mutation<any, { note?: string }>({
      query: (body) => ({
        url: '/attendance/check-out',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Attendance'],
    }),

  }),
});

// Xuất các Hook để Component sử dụng
export const {
  useGetTodayScheduleQuery,
  useCheckInMutation,
  useCheckOutMutation,
} = attendanceApi;