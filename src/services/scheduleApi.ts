import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSession } from 'next-auth/react';

export interface Schedule {
  id: number;
  userId: number;
  startTime: string; 
  endTime: string;
  status: string;
  note?: string;
  // 👇 Cập nhật thêm 2 trường mới cho interface để Typescript nhận diện
  isPublished: boolean;
  attendanceStatus: string;
}

export interface ScheduleSettings {
  id: number;
  isOpen: boolean;
  closeTime: string;
  shiftStartDate: string;
  shiftEndDate: string;
}

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8386',
    prepareHeaders: async (headers) => {
      const session: any = await getSession();
      const token = session?.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Schedules', 'ScheduleSettings'], 
  endpoints: (builder) => ({
    
    createSchedule: builder.mutation<any, { userId: number; startTime: string; endTime: string; note?: string; settingId?: number }>({
      query: (body) => ({
        url: '/schedule',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Schedules'],
    }),
    
    getSchedules: builder.query<Schedule[], { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => `/schedule?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Schedules'],
    }),
    
    updateSchedule: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/schedule/${id}`,
        method: 'PATCH', 
        body: data,
      }),
      invalidatesTags: ['Schedules'], 
    }),

    deleteSchedule: builder.mutation<any, number>({
      query: (id) => ({
        url: `/schedule/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedules'], 
    }),

    getScheduleSettings: builder.query<ScheduleSettings, void>({
      query: () => '/notifications/schedule-settings', 
      providesTags: ['ScheduleSettings'], 
    }),
    
    openScheduleSetting: builder.mutation<any, { closeTime: string; shiftStartDate: string; shiftEndDate: string }>({
      query: (body) => ({
        url: '/schedule/open-setting', 
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ScheduleSettings'], 
    }),

    // 👇 ĐÃ ĐỔI TÊN HÀM VÀ ĐƯỜNG DẪN URL THÀNH PUBLISH 👇
    publishSchedules: builder.mutation<any, { scheduleIds: number[], startDate: string, endDate: string }>({
      query: (body) => ({
        url: '/schedule/publish', 
        method: 'PATCH',
        body, // Gửi cả scheduleIds, startDate và endDate xuống BE
      }),
      invalidatesTags: ['Schedules'],
    }),
  }),
})

export const {
  useCreateScheduleMutation,
  useGetSchedulesQuery,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useGetScheduleSettingsQuery,
  useOpenScheduleSettingMutation,
  // 👇 ĐÃ ĐỔI TÊN EXPORT HOOK THÀNH PUBLISH 👇
  usePublishSchedulesMutation
} = scheduleApi