"use client"

import React, { useState, useMemo, useEffect } from "react"
import { addDays, startOfWeek, format } from "date-fns"
import { vi } from "date-fns/locale"
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle, Search, Plus, Calendar, User as UserIcon, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "../uiAdmin/scroll-area" // Chú ý kiểm tra lại đường dẫn này trong máy bạn
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton" // 👇 Thêm hiệu ứng loading

// 👇 1. Import hook lấy user thật từ Redux
import { useGetUsersQuery, User } from "@/services/userApi"
import { AddScheduleModal } from "../uiAdmin/AddScheduleModal"

// --- DỮ LIỆU MẪU LỊCH TRÌNH (Tạm thời giữ nguyên để test layout) ---
const MOCK_SCHEDULES = [
  { id: 101, userId: 1, startTime: new Date("2026-02-16T08:00:00"), endTime: new Date("2026-02-16T12:00:00"), status: "APPROVED" },
  { id: 102, userId: 1, startTime: new Date("2026-02-18T13:30:00"), endTime: new Date("2026-02-18T17:45:00"), status: "PENDING" },
  { id: 103, userId: 2, startTime: new Date("2026-02-16T06:00:00"), endTime: new Date("2026-02-16T14:30:00"), status: "APPROVED" },
  { id: 104, userId: 1, startTime: new Date("2026-02-20T18:00:00"), endTime: new Date("2026-02-20T23:30:00"), status: "REJECTED" },
]

const START_HOUR = 6;
const END_HOUR = 24;
const HOUR_HEIGHT = 60;
const HOURS_ARRAY = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR);

export function AdminScheduleBoard() {
  // 👇 2. Gọi API lấy user thật
  const { data: users = [], isLoading } = useGetUsersQuery();

  const [currentDate, setCurrentDate] = useState(new Date("2026-02-16T00:00:00"))
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 👇 3. Đổi state thành User | null (Vì lúc đầu chưa có data)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // 👇 4. Tự động chọn user đầu tiên khi dữ liệu API tải xong
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i))

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7))
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7))

  // 👇 5. Tìm kiếm trên mảng users thật
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    return users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, users]);

  const getSchedulesForSelectedUser = (day: Date) => {
    if (!selectedUser) return [];
    // Tạm thời vẫn lọc theo ID của Mock Schedule (cần đổi kiểu ID nếu ID của User là chuỗi)
    return MOCK_SCHEDULES.filter(
      (s) => s.userId === Number(selectedUser.id) && s.startTime.toDateString() === day.toDateString()
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white border-emerald-500 shadow-emerald-200"
      case "PENDING": return "bg-gradient-to-r from-orange-400 to-orange-600 text-white border-orange-500 shadow-orange-200"
      case "REJECTED": return "bg-gradient-to-r from-rose-400 to-rose-600 text-white border-rose-500 shadow-rose-200 opacity-75"
      default: return "bg-gradient-to-r from-slate-400 to-slate-600 text-white border-slate-500 shadow-slate-200"
    }
  }

  const calculateBlockStyle = (startTime: Date, endTime: Date) => {
    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
    const endHour = endTime.getHours() + endTime.getMinutes() / 60;
    const clampedStart = Math.max(START_HOUR, Math.min(END_HOUR, startHour));
    const clampedEnd = Math.max(START_HOUR, Math.min(END_HOUR, endHour));
    const top = (clampedStart - START_HOUR) * HOUR_HEIGHT;
    const height = (clampedEnd - clampedStart) * HOUR_HEIGHT;

    return { top: `${top}px`, height: `${height}px` };
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-40px)] bg-gradient-to-br from-slate-100 to-slate-200 p-6 overflow-hidden">

      {/* CỘT TRÁI: Danh sách User */}
      <div className="w-[280px] flex-shrink-0 bg-white rounded-3xl shadow-2xl border border-slate-200/60 flex flex-col overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-slate-100">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
            <UserIcon className="w-5 h-5 text-blue-600" />
            Nhân sự ({filteredUsers.length})
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm tên..."
              className="pl-9 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {/* 👇 6. Hiển thị Skeleton nếu đang tải dữ liệu */}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : filteredUsers.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-8">Không tìm thấy nhân viên.</div>
            ) : (
              filteredUsers.map((user) => {
                const isActive = selectedUser?.id === user.id;
                return (
                  <div
                    key={user.id} onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-2 py-2 px-3 rounded-2xl cursor-pointer transition-colors duration-150 ${isActive ? 'bg-blue-50 ring-1 ring-blue-200' : 'bg-white hover:bg-slate-50'}`}
                  >
                    {/* Avatar (smaller for compact list) */}
                    <Avatar className="h-10 w-10 border-2 border-slate-200">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} className="object-cover" />
                      ) : (
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                      )}
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="font-semibold text-sm truncate text-slate-800">{user.name}</span>
                      <span className={`text-[10px] font-bold tracking-wider uppercase mt-1 w-fit px-1.5 py-0.5 rounded-md ${user.role === 'ADMIN' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: Bảng Timeline (Giữ nguyên cấu trúc của bạn) */}
      <div className="flex-1 bg-white rounded-3xl shadow-2xl border border-slate-200/60 flex flex-col overflow-hidden backdrop-blur-sm">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-white to-slate-50 z-20">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Lịch trình: <span className="text-blue-600">{selectedUser?.name || "Đang tải..."}</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">Timeline từ 06:00 đến 24:00</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg"
              onClick={() => setIsAddModalOpen(true)} // 👈 Gắn sự kiện mở
            >
              <Plus className="w-4 h-4 mr-2" /> Thêm lịch
            </Button>
            <div className="flex items-center bg-slate-100/80 rounded-xl p-1 border shadow-sm">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={handlePrevWeek}><ChevronLeft className="w-4 h-4" /></Button>
              <span className="text-sm font-bold px-4 w-[220px] text-center text-slate-700">
                {format(startDate, "dd/MM/yyyy")} - {format(addDays(startDate, 6), "dd/MM/yyyy")}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={handleNextWeek}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        {/* Timeline Area */}
        <div className="flex-1 bg-gradient-to-b from-slate-50/30 to-slate-100/30 relative overflow-y-auto">

          {/* Day Header */}
          <div className="sticky top-0 z-30 grid grid-cols-[60px_repeat(7,1fr)] bg-white/90 backdrop-blur-sm border-b shadow-lg">
            <div className="border-r border-slate-200 bg-slate-50"></div>
            {weekDays.map((day) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div key={day.toString()} className={`p-4 text-center border-r border-slate-200 last:border-r-0 ${isToday ? 'bg-gradient-to-b from-blue-50 to-blue-100' : ''}`}>
                  <div className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-blue-700' : 'text-slate-500'}`}>
                    {format(day, "EEEE", { locale: vi })}
                  </div>
                  <div className={`text-lg font-black mt-1 ${isToday ? 'text-blue-700' : 'text-slate-800'}`}>
                    {format(day, "dd")}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time Grid */}
          <div className="relative min-w-[700px]">

            {/* Hour Lines */}
            {HOURS_ARRAY.map((hour) => (
              <div key={hour} className="grid grid-cols-[60px_1fr] border-b border-slate-200/50" style={{ height: `${HOUR_HEIGHT}px` }}>
                <div className="text-right pr-3 pt-2 text-xs text-slate-500 font-medium bg-slate-50/50 border-r border-slate-200 flex items-start justify-end">
                  <span className="bg-white px-2 py-1 rounded shadow-sm border">
                    {hour === 24 ? "24:00" : `${hour.toString().padStart(2, '0')}:00`}
                  </span>
                </div>
                <div className="grid grid-cols-7 relative">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="border-r border-slate-200/30 last:border-r-0 h-full w-full hover:bg-slate-100/20 transition-colors"></div>
                  ))}
                </div>
              </div>
            ))}

            {/* Schedule Blocks */}
            <div className="absolute top-0 left-[60px] right-0 bottom-0 grid grid-cols-7 pointer-events-none">
              {weekDays.map((day, index) => {
                const daySchedules = getSchedulesForSelectedUser(day);

                return (
                  <div key={index} className="relative h-full border-r border-transparent last:border-r-0 pointer-events-auto">
                    {daySchedules.map((schedule) => {
                      const style = calculateBlockStyle(schedule.startTime, schedule.endTime);

                      return (
                        <div
                          key={schedule.id}
                          className={`absolute left-2 right-2 p-3 rounded-xl border-2 shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:z-20 overflow-hidden flex flex-col group ${getStatusColor(schedule.status)}`}
                          style={style}
                        >
                          <div className="font-bold text-sm truncate flex items-center justify-between">
                            {format(schedule.startTime, "HH:mm")} - {format(schedule.endTime, "HH:mm")}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 bg-white/20 hover:bg-white/40">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 bg-white/20 hover:bg-white/40">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs font-semibold mt-2 opacity-90 uppercase tracking-wide flex items-center gap-1">
                            {schedule.status === "PENDING" && <Clock className="w-3 h-3" />}
                            {schedule.status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
                            {schedule.status === "REJECTED" && <XCircle className="w-3 h-3" />}
                            {schedule.status}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
      <AddScheduleModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        users={users} // Truyền danh sách user để đổ vào Select
        defaultUserId={selectedUser?.id} // Tự động chọn người đang xem lịch
      />

    </div>
  )
}