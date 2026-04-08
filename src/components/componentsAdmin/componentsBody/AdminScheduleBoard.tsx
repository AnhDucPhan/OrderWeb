"use client"

import React, { useState, useMemo } from "react"
import { format, addDays, subDays, isSameDay, startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Edit, Plus, Trash2, CheckCircle2, Loader2, BellRing } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Import hooks gọi API và Component Thêm/Sửa
import { useGetUsersQuery } from "@/services/userApi"
import { useDeleteScheduleMutation, useGetSchedulesQuery, usePublishSchedulesMutation } from "@/services/scheduleApi"
import { AddScheduleModal } from "../uiAdmin/ScheduleModal"
import { useSession } from "next-auth/react"
import { useBroadcastOpenScheduleMutation } from "@/services/notificationApi"
import BroadcastScheduleModal from "../uiAdmin/BroadcastScheduleModal"
import ReviewScheduleModal from "../uiAdmin/ReviewScheduleModal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// ==============================================
// CẤU HÌNH TRỤC Y VÀ UI
// ==============================================
const START_HOUR = 6;
const END_HOUR = 23;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const HOURS_ARRAY = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => i + START_HOUR);

const CARD_WIDTH = 160;
const CARD_GAP = 16;

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED": return "bg-white border-emerald-500 shadow-sm"
    case "PENDING": return "bg-amber-50 border-amber-300 border-dashed shadow-sm"
    case "REJECTED": return "bg-rose-50 border-rose-300 shadow-sm opacity-70"
    default: return "bg-white border-slate-300 shadow-sm"
  }
}

const calculateBlockStyle = (startTime: any, endTime: any) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  const clampedStart = Math.max(START_HOUR, Math.min(END_HOUR, startHour));
  const clampedEnd = Math.max(START_HOUR, Math.min(END_HOUR, endHour));
  const topPercent = ((clampedStart - START_HOUR) / TOTAL_HOURS) * 100;
  const heightPercent = ((clampedEnd - clampedStart) / TOTAL_HOURS) * 100;
  return { top: `${topPercent}%`, height: `${heightPercent}%` };
}

// ==============================================
// THUẬT TOÁN: LÀN SÓNG (WAVE) + DỒN CỘT (COMPACT)
// ==============================================
const processSchedules = (schedules: any[]) => {
  if (!schedules || schedules.length === 0) return [];

  const sorted = schedules.map(s => ({ ...s })).sort((a, b) => {
    const timeDiff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    if (timeDiff === 0) return a.id - b.id;
    return timeDiff;
  });

  const columnsMaxEndTime: number[] = [];
  let currentWaveStart = -1;
  let waveIndex = -1;

  sorted.forEach((s) => {
    const startTimestamp = new Date(s.startTime).getTime();
    const endTimestamp = new Date(s.endTime).getTime();

    if (currentWaveStart === -1 || (startTimestamp - currentWaveStart) > 3 * 60 * 60 * 1000) {
      currentWaveStart = startTimestamp;
      waveIndex++;
    }

    let targetCol = waveIndex % 2 === 0 ? 0 : 1;
    while (columnsMaxEndTime[targetCol] && startTimestamp < columnsMaxEndTime[targetCol]) {
      targetCol += 2;
    }
    s.column = targetCol;
    columnsMaxEndTime[targetCol] = endTimestamp;
  });

  const usedColumns = Array.from(new Set(sorted.map(s => s.column))).sort((a, b) => a - b);
  const columnMap = new Map();
  usedColumns.forEach((oldCol, newCol) => columnMap.set(oldCol, newCol));

  sorted.forEach(s => {
    s.column = columnMap.get(s.column);
  });

  return sorted;
}

export default function AdminScheduleBoard() {
  // STATE CƠ BẢN
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [scheduleToReview, setScheduleToReview] = useState<any | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

  const { data: allSchedules = [], isLoading: isSchedulesLoading } = useGetSchedulesQuery({
    startDate: weekStart.toISOString(),
    endDate: weekEnd.toISOString()
  });
  const { data: usersData } = useGetUsersQuery({ page: 1, perPage: 100 });
  const usersList = usersData?.data || [];
  const [deleteSchedule] = useDeleteScheduleMutation();
  const { data: session } = useSession();


  const currentUser = session?.user;
  const isManager = currentUser?.role === 'MANAGER' || currentUser?.position === 'Store Manager';
  const users = usersData || [];

  const [publishSchedules, { isLoading: isPublishing }] = usePublishSchedulesMutation();

  // ==============================================
  // XỬ LÝ DỮ LIỆU (Chỉ chạy khi có thay đổi)
  // ==============================================
  const { processedSchedules, pendingSchedules, unpublishedApproved, futurePending } = useMemo(() => {

    // 👇 SỬA ĐỔI: TẤT CẢ MỌI NGƯỜI ĐỀU ĐƯỢC NHÌN THẤY TOÀN BỘ LỊCH
    // Nếu bạn chỉ muốn nhân viên thấy lịch đã duyệt, hãy thêm: allSchedules.filter(s => s.status === 'APPROVED')
    const allowedSchedules = allSchedules;

    // ==========================================
    // KHỐI 1: DỮ LIỆU CHO TIMELINE GIỮA MÀN HÌNH
    // ==========================================
    const schedulesForSelectedDay = allowedSchedules.filter((s: any) =>
      isSameDay(new Date(s.startTime), selectedDate)
    );

    const processed = processSchedules(schedulesForSelectedDay);
    const pending = schedulesForSelectedDay.filter((s: any) => s.status === 'PENDING');

    // ==========================================
    // KHỐI 2: DỮ LIỆU CHO SIDEBAR BÊN PHẢI (CÔNG BỐ)
    // ==========================================
    const now = new Date();

    const readyToPublish = allowedSchedules
      .filter((s: any) =>
        s.status === 'APPROVED' &&
        s.isPublished === false &&
        new Date(s.startTime) > now
      )
      .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const pendingInFuture = allowedSchedules
      .filter((s: any) =>
        s.status === 'PENDING' &&
        new Date(s.startTime) > now
      )
      .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());


    return {
      processedSchedules: processed,
      pendingSchedules: pending,
      unpublishedApproved: readyToPublish,
      futurePending: pendingInFuture
    };
  }, [allSchedules, selectedDate]); // 👈 Bỏ isManager và currentUser ra khỏi dependency vì giờ ai cũng thấy hết

  const containerMinWidth = useMemo(() => {
    if (processedSchedules.length === 0) return 0;
    const maxColumnIndex = Math.max(...processedSchedules.map(s => s.column));
    return ((maxColumnIndex + 1) * (CARD_WIDTH + CARD_GAP)) + CARD_GAP + 50;
  }, [processedSchedules]);


  const handlePublishAll = async () => {
    try {
      const idsToPublish = unpublishedApproved.map((s: any) => s.id);

      await publishSchedules({
        scheduleIds: idsToPublish,
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString()
      }).unwrap();

      toast.success(`Đã công bố chính thức ${idsToPublish.length} ca làm mới!`);
      setIsPublishModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Lỗi hệ thống khi công bố lịch");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ca làm việc này?")) return;
    try {
      await deleteSchedule(id).unwrap();
      toast.success("Đã xóa ca làm việc!");
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  const handleEdit = (schedule: any) => {
    setEditingSchedule(schedule);
    setIsAddModalOpen(true);
  };

  const handleOpenReview = (schedule: any) => {
    setScheduleToReview(schedule);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-100px)] gap-6 w-full">

      {/* ================= KHỐI TRUNG TÂM: TIMELINE CHÍNH ================= */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Lịch làm việc</h2>
            <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100 ml-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-white hover:shadow-sm" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </Button>
              <Button variant="ghost" className="h-8 px-4 text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm" onClick={() => setSelectedDate(new Date())}>
                {isSameDay(selectedDate, new Date()) ? "Hôm nay" : format(selectedDate, "dd/MM/yyyy")}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-white hover:shadow-sm" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </Button>
            </div>
          </div>

          {/* 👇 SỬA ĐỔI: CHỈ RENDER KHỐI NÚT NÀY NẾU LÀ QUẢN LÝ 👇 */}
          {isManager && (
            <div className="flex items-center gap-3">
              <BroadcastScheduleModal />
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-5 h-10 font-medium"
                onClick={() => {
                  setEditingSchedule(null);
                  setIsAddModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Tạo ca làm
              </Button>
            </div>
          )}
        </div>

        {/* TIMELINE CONTENT */}
        <div className="flex-1 overflow-auto bg-slate-50 relative custom-scrollbar">
          <div className="flex min-h-full min-w-max">
            {/* Cột Mốc Giờ */}
            <div className="sticky left-0 top-0 z-30 w-[60px] bg-white border-r border-slate-100 shadow-[2px_0_10px_rgba(0,0,0,0.02)] py-4">
              <div className="relative w-full h-[800px]">
                {HOURS_ARRAY.map((hour) => {
                  const topPercent = ((hour - START_HOUR) / TOTAL_HOURS) * 100;
                  return (
                    <div key={hour} className="absolute w-full" style={{ top: `${topPercent}%` }}>
                      <div className="absolute right-3 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                        {`${hour.toString().padStart(2, '0')}:00`}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Vùng Vẽ Các Thẻ Lịch */}
            <div className="relative py-4 flex-1" style={{ minWidth: `${Math.max(containerMinWidth, 800)}px` }}>
              <div className="relative w-full h-[800px]">
                <div className="absolute inset-0 pointer-events-none">
                  {HOURS_ARRAY.map((hour) => {
                    const topPercent = ((hour - START_HOUR) / TOTAL_HOURS) * 100;
                    return <div key={hour} className="absolute left-0 right-0 border-b border-slate-200/50" style={{ top: `${topPercent}%` }} />
                  })}
                </div>

                <div className="absolute inset-0">
                  {processedSchedules.map((schedule) => {
                    const user = schedule.user;
                    const timeStyle = calculateBlockStyle(schedule.startTime, schedule.endTime);
                    const leftPosition = (schedule.column * (CARD_WIDTH + CARD_GAP)) + CARD_GAP;

                    return (
                      <div
                        key={schedule.id}
                        // 👇 SỬA ĐỔI: NẾU KHÔNG PHẢI QUẢN LÝ THÌ XÓA CON TRỎ CHUỘT (cursor-default) VÀ KHÔNG CÓ HIỆU ỨNG NỔI LÊN 👇
                        className={`absolute p-3 rounded-2xl border-2 transition-all duration-200 overflow-hidden flex flex-col justify-between group ${getStatusColor(schedule.status)} ${isManager ? 'hover:scale-[1.02] hover:shadow-lg hover:z-20 cursor-pointer' : 'cursor-default'}`}
                        style={{ ...timeStyle, width: `${CARD_WIDTH}px`, left: `${leftPosition}px` }}
                        // Chỉ cho phép click để mở form Sửa nếu là Quản lý
                        onClick={() => isManager && handleEdit(schedule)}
                      >
                        <div className="flex justify-between items-start">
                          <Avatar className="h-9 w-9 border border-white shadow-sm">
                            <AvatarImage src={user?.avatar} className="object-cover" />
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xs">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>

                          {/* 👇 SỬA ĐỔI: CHỈ HIỂN THỊ NÚT XÓA NẾU LÀ QUẢN LÝ 👇 */}
                          {isManager && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-lg flex gap-1 p-0.5 shadow-sm border border-slate-100">
                              <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-rose-100 text-rose-600 rounded-md"
                                onClick={(e) => { e.stopPropagation(); handleDelete(schedule.id); }}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="mt-2">
                          <div className="font-bold text-[13px] text-slate-800 leading-tight truncate">{user?.name}</div>
                          <div className="text-[10px] mt-0.5 font-bold text-slate-500 uppercase tracking-wider truncate">{user?.role}</div>
                        </div>

                        <div className="pt-2 border-t border-black/5 mt-2 flex items-center justify-between">
                          <span className="flex items-center gap-1 font-bold text-[11px] text-slate-600">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {format(new Date(schedule.startTime), "HH:mm")} - {format(new Date(schedule.endTime), "HH:mm")}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= KHỐI BÊN PHẢI: SIDEBAR LỊCH & CHỜ DUYỆT ================= */}
      <div className="w-full xl:w-[340px] flex flex-col gap-6 shrink-0">

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" /> Chọn ngày xem
          </h3>
          <div className="flex justify-center border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={vi}
              className="bg-transparent"
              classNames={{
                day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                day_today: "bg-blue-50 text-blue-600 font-bold",
              }}
            />
          </div>
        </div>

        {/* 👇 SỬA ĐỔI: TOÀN BỘ KHỐI "CHỜ CÔNG BỐ" ĐƯỢC BỌC TRONG ĐIỀU KIỆN isManager 👇 */}
        {isManager && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[300px]">
            {/* HEADER & NÚT CÔNG BỐ */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <h3 className="font-black text-slate-800 text-lg">Chờ công bố ({unpublishedApproved.length})</h3>
                <span className="text-xs font-bold text-slate-400">Các ca từ hiện tại trở đi</span>
              </div>

              {unpublishedApproved.length > 0 && (
                <Button
                  onClick={() => setIsPublishModalOpen(true)}
                  disabled={isPublishing}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-8 px-3 rounded-lg shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Duyệt lịch làm
                </Button>
              )}
            </div>

            {/* DANH SÁCH CA LÀM CHỜ CÔNG BỐ */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {unpublishedApproved.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-60 mt-10">
                  <CheckCircle2 className="w-10 h-10 text-blue-400" />
                  <p className="text-sm font-medium">Không có ca nào chờ công bố</p>
                </div>
              ) : (
                unpublishedApproved.map((schedule: any) => (
                  <div
                    key={schedule.id}
                    className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col gap-2 cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => handleOpenReview(schedule)}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-white shadow-sm">
                        <AvatarImage src={schedule.user?.avatar} />
                        <AvatarFallback className="bg-white text-blue-700 text-xs">{schedule.user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-sm text-slate-800">{schedule.user?.name}</div>

                        <div className="text-[11px] font-semibold text-blue-600/80 mt-0.5">
                          {format(new Date(schedule.startTime), "dd/MM/yyyy")}
                        </div>
                        <div className="text-xs font-bold text-blue-700 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(schedule.startTime), "HH:mm")} - {format(new Date(schedule.endTime), "HH:mm")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL XÁC NHẬN CÔNG BỐ LỊCH */}
      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <BellRing className="w-5 h-5" />
              Xác nhận công bố lịch
            </DialogTitle>
            <DialogDescription>
              Bạn đang chuẩn bị chốt lịch làm việc và gửi thông báo cho nhân viên.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <span className="text-3xl font-black text-blue-600">{unpublishedApproved.length}</span>
              <span className="text-sm font-semibold text-blue-800">Ca làm việc hợp lệ</span>
              <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full mt-2 shadow-sm border border-slate-100">
                Tuần: {format(weekStart, "dd/MM/yyyy")} - {format(weekEnd, "dd/MM/yyyy")}
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4 text-center">
              Hệ thống sẽ gửi ngay thông báo đẩy đến điện thoại của các nhân viên có ca làm trong danh sách này.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPublishModalOpen(false)} disabled={isPublishing}>
              Hủy bỏ
            </Button>
            <Button
              onClick={handlePublishAll}
              disabled={isPublishing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Xác nhận Công bố
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddScheduleModal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSchedule(null);
        }}
        users={usersList}
        editData={editingSchedule}
        isManager={isManager}
        currentUser={currentUser}
      />

      <ReviewScheduleModal
        open={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setScheduleToReview(null);
        }}
        schedule={scheduleToReview}
      />
    </div>
  )
}