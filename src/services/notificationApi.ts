import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

// Định nghĩa kiểu dữ liệu cho cái thông báo
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', // 👉 Nhớ đổi port cho giống file scheduleApi của bạn
    prepareHeaders: async (headers, { getState }) => {
      const session: any = await getSession();
      const token = session?.accessToken;
      if (token) {
        // 2. Cắt bỏ dấu ngoặc kép thừa (nếu có)
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Notification'], // Khai báo cái tag này để tí nữa Socket nó gọi Invalidate
  endpoints: (builder) => ({
    broadcastOpenSchedule: builder.mutation<{ success: boolean; message: string }, { closeTime: string, shiftStartDate: string, shiftEndDate: string }>({
      query: (body) => ({
        url: '/notifications/broadcast-open',
        method: 'POST',
        body: body, // Truyền 3 tham số ngày tháng lên Backend
      }),
    }),
    // 1. Lấy danh sách hòm thư
    getMyNotifications: builder.query<Notification[], void>({
      query: () => '/notifications/my-inbox',
      providesTags: ['Notification'],
    }),

    // 2. Đánh dấu đã đọc
    markAsRead: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'], // Bấm đọc xong thì tự động làm mới danh sách
    }),

  }),
});

// Export các hook để dùng bên giao diện
export const {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useBroadcastOpenScheduleMutation
} = notificationApi;