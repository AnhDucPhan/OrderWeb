"use client"

import React, { useState, useMemo, useEffect } from "react"
import { addDays, startOfWeek, format } from "date-fns"
import { vi } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Search, Plus, Calendar, User as UserIcon, SunMedium, MoonStar, Users, Clock, CheckCircle2, XCircle, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { useGetUsersQuery, User } from "@/services/userApi"
import { AddScheduleModal } from "../uiAdmin/AddScheduleModal"
import { useGetSchedulesQuery, Schedule, useDeleteScheduleMutation } from "@/services/scheduleApi"
import { ShiftDetailsModal } from "../uiAdmin/ShiftDetailsModal"

// Định nghĩa 2 ca cố định
const SHIFTS = [
  { id: 'morning', name: 'Ca Sáng', time: '06:30 - 14:30', icon: SunMedium, color: 'from-amber-100 to-orange-100 border-amber-200 text-amber-800' },
  { id: 'evening', name: 'Ca Tối', time: '14:30 - 22:30', icon: MoonStar, color: 'from-indigo-100 to-blue-100 border-indigo-200 text-indigo-800' }
];


export function AdminScheduleBoard() {
  const { data: users = [], isLoading: isUsersLoading } = useGetUsersQuery();

  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // State để quản lý Modal xem chi tiết ca làm
  const [viewingShift, setViewingShift] = useState<{ date: Date, shiftName: string, schedules: any[] } | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true) }, []);

  // --- TÍNH TOÁN NGÀY THÁNG ---
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
  const endDate = addDays(startDate, 6)
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i))

  const formattedStart = format(startDate, 'yyyy-MM-dd')
  const formattedEnd = format(endDate, 'yyyy-MM-dd')

  const { data: rawSchedules = [], isLoading: isSchedulesLoading } = useGetSchedulesQuery({
    startDate: formattedStart,
    endDate: formattedEnd
  });

  const realSchedules = useMemo(() => {
    return rawSchedules.map(schedule => ({
      ...schedule,
      startTime: new Date(schedule.startTime),
      endTime: new Date(schedule.endTime),
      // Map thêm thông tin user vào schedule để tiện hiển thị
      user: users.find(u => Number(u.id) === schedule.userId)
    }));
  }, [rawSchedules, users]);

  useEffect(() => {
    if (users.length > 0 && !selectedUser) setSelectedUser(users[0]);
  }, [users, selectedUser]);

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7))
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7))

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    return users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, users]);

  // Lấy toàn bộ lịch làm việc trong 1 ngày cụ thể
  const getSchedulesForDay = (day: Date) => {
    return realSchedules.filter(s => s.startTime.toDateString() === day.toDateString());
  };

  // Kéo hook xóa ra
  const [deleteSchedule] = useDeleteScheduleMutation();

  // State lưu trữ ca làm đang được chọn để Sửa
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);

  // --- HÀM XỬ LÝ XÓA ---
  const handleDeleteSchedule = async (scheduleId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ca làm này không? Hành động này không thể hoàn tác!")) {
      try {
        await deleteSchedule(scheduleId).unwrap();
        // Có thể thêm thư viện Toast (sonner/react-hot-toast) để hiện thông báo Xóa Thành Công ở đây
      } catch (error) {
        console.error("Lỗi xóa lịch:", error);
        alert("Có lỗi xảy ra khi xóa!");
      }
    }
  };

  // --- HÀM XỬ LÝ MỞ MODAL SỬA ---
  const handleEditSchedule = (schedule: any) => {
    setEditingSchedule(schedule); // Lưu data của ca làm vào state
    setIsAddModalOpen(true);      // Mở lại cái Modal "Thêm Lịch" (Sẽ tái sử dụng nó làm Modal Sửa)
  };

  // Tìm Manager/Senior của một mảng lịch làm việc
  const getShiftManager = (shiftSchedules: any[]) => {
    return shiftSchedules.find(s =>
      s.user?.role === 'ADMIN' ||
      s.user?.position?.toLowerCase().includes('manager') ||
      s.user?.position?.toLowerCase().includes('senior')
    )?.user;
  };
  
  useEffect(() => {
    if (viewingShift && realSchedules.length > 0) {
      const viewingDateString = viewingShift.date.toDateString();
      
      // Lọc lại mảng data mới nhất từ Redux để tìm các ca làm thuộc về "Ngày đang mở trên Modal"
      const freshSchedulesForDay = realSchedules
        .map(s => ({ ...s, startTime: new Date(s.startTime), endTime: new Date(s.endTime) }))
        .filter(s => s.startTime.toDateString() === viewingDateString);

      // Bơm vào state -> Modal tự động giật thẻ đến khung giờ mới / biến mất nếu bị xóa
      setViewingShift(prev => prev ? {
        ...prev,
        schedules: freshSchedulesForDay
      } : null);
    }
  }, [realSchedules]);

  if (!isMounted) return null;

  return (
    <div className="flex gap-6 h-[calc(100vh-40px)] bg-slate-50 p-6 overflow-hidden">

      {/* CỘT TRÁI: Danh sách User (GIỮ NGUYÊN NHƯ CŨ) */}
      <div className="w-[280px] flex-shrink-0 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
        {/* ... (Đoạn mã cột trái của bạn giữ nguyên 100%) ... */}
        <div className="p-6 border-b bg-slate-50/50">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
            <UserIcon className="w-5 h-5 text-blue-600" />
            Nhân sự ({filteredUsers.length})
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Tìm tên..." className="pl-9 bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {isUsersLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
                </div>
              ))
            ) : filteredUsers.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-8">Không tìm thấy nhân viên.</div>
            ) : (
              filteredUsers.map((user) => {
                const isActive = selectedUser?.id === user.id;
                return (
                  <div key={user.id} onClick={() => setSelectedUser(user)} className={`flex items-center gap-3 py-2 px-3 rounded-xl cursor-pointer transition-colors ${isActive ? 'bg-blue-50 ring-1 ring-blue-200' : 'bg-white hover:bg-slate-50'}`}>
                    <Avatar className="h-10 w-10"><AvatarImage src={user.avatar} className="object-cover" /><AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="font-semibold text-sm truncate text-slate-800">{user.name}</span>
                      <span className={`text-[10px] font-bold uppercase mt-0.5 w-fit px-1.5 py-0.5 rounded-md ${user.role === 'ADMIN' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>{user.role}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: Bảng Grid Shift-based (THIẾT KẾ MỚI) */}
      <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b z-20">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Tổng quan ca làm việc
            </h2>
            <p className="text-sm text-slate-500 mt-1">Cửa hàng: Cơ sở 1</p>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md" onClick={() => {
              setEditingSchedule(null);
              setIsAddModalOpen(true)
            }}>
              <Plus className="w-4 h-4 mr-2" /> Thêm lịch
            </Button>
            <div className="flex items-center bg-slate-50 rounded-xl p-1 border">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white rounded-lg" onClick={handlePrevWeek}><ChevronLeft className="w-4 h-4" /></Button>
              <span className="text-sm font-bold px-4 w-[220px] text-center text-slate-700">{format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white rounded-lg" onClick={handleNextWeek}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        {/* Lưới Lịch Làm Việc Mới */}
        <div className="flex-1 overflow-auto bg-slate-50/50 p-6">
          <div className="grid grid-cols-7 gap-4 min-w-[900px] h-full">

            {weekDays.map((day, index) => {
              const isToday = day.toDateString() === new Date().toDateString();

              // 1. Lấy tất cả lịch của ngày hôm đó
              const daySchedules = getSchedulesForDay(day);

              // 2. Tách tạm ra 2 mảng Sáng/Tối để đếm người và tìm Manager hiển thị ở ngoài Grid
              const morningSchedules = daySchedules.filter(s => s.startTime.getHours() >= 5 && s.startTime.getHours() < 14);
              const eveningSchedules = daySchedules.filter(s => s.startTime.getHours() >= 14 && s.startTime.getHours() < 24);

              const morningManager = getShiftManager(morningSchedules);
              const eveningManager = getShiftManager(eveningSchedules);

              return (
                <div key={index} className={`flex flex-col gap-4 ${isToday ? 'ring-2 ring-blue-300 rounded-2xl bg-blue-50/50 p-1.5 -m-1.5' : ''}`}>

                  {/* Tiêu đề Ngày */}
                  <div className="text-center pb-2 border-b-2 border-slate-200/60">
                    <div className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>
                      {format(day, "EEEE", { locale: vi })}
                    </div>
                    <div className={`text-2xl font-black mt-1 ${isToday ? 'text-blue-600' : 'text-slate-800'}`}>
                      {format(day, "dd")}
                    </div>
                  </div>

                  {/* KHỐI CARD DUY NHẤT GỘP 2 CA (Click để xem cả ngày) */}
                  <div
                    onClick={() => setViewingShift({ date: day, shiftName: "Toàn bộ lịch làm việc", schedules: daySchedules })}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden group"
                  >

                    {/* NỬA TRÊN: CA SÁNG */}
                    <div className="flex-1 p-3 bg-gradient-to-br from-amber-50 to-orange-50/50 border-b border-slate-100 flex flex-col group-hover:from-amber-100/80 transition-colors">
                      <div className="flex items-center justify-between mb-2 opacity-80 text-amber-900">
                        <span className="font-bold text-xs">Ca Sáng</span>
                        <SunMedium className="w-4 h-4" />
                      </div>

                      <div className="mt-auto bg-white/70 rounded-xl p-2 backdrop-blur-sm border border-white">
                        <div className="text-[9px] uppercase font-bold text-amber-700/60 mb-0.5">Quản lý ca</div>
                        {morningManager ? (
                          <div className="font-bold text-xs truncate text-amber-950" title={morningManager.name}>{morningManager.name}</div>
                        ) : (
                          <div className="text-[11px] text-rose-500 font-bold italic">Chưa phân bổ</div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-amber-800 opacity-80">
                        <Users className="w-3.5 h-3.5" /> {morningSchedules.length} nhân sự
                      </div>
                    </div>

                    {/* NỬA DƯỚI: CA TỐI */}
                    <div className="flex-1 p-3 bg-gradient-to-br from-indigo-50 to-blue-50/50 flex flex-col group-hover:from-indigo-100/80 transition-colors">
                      <div className="flex items-center justify-between mb-2 opacity-80 text-indigo-900">
                        <span className="font-bold text-xs">Ca Tối</span>
                        <MoonStar className="w-4 h-4" />
                      </div>

                      <div className="mt-auto bg-white/70 rounded-xl p-2 backdrop-blur-sm border border-white">
                        <div className="text-[9px] uppercase font-bold text-indigo-700/60 mb-0.5">Quản lý ca</div>
                        {eveningManager ? (
                          <div className="font-bold text-xs truncate text-indigo-950" title={eveningManager.name}>{eveningManager.name}</div>
                        ) : (
                          <div className="text-[11px] text-rose-500 font-bold italic">Chưa phân bổ</div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-indigo-800 opacity-80">
                        <Users className="w-3.5 h-3.5" /> {eveningSchedules.length} nhân sự
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <AddScheduleModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} users={users} defaultUserId={selectedUser?.id} editData={editingSchedule} />

      <ShiftDetailsModal
        isOpen={!!viewingShift}
        onClose={() => {
          setViewingShift(null);
          setEditingSchedule(null);
        }}
        shiftData={viewingShift}
        onEdit={handleEditSchedule}
        onDelete={handleDeleteSchedule}
      />

    </div>
  )
}