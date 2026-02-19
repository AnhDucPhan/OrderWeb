"use client"

import React, { useState, useMemo } from "react"
import { addDays, startOfWeek, format } from "date-fns"
import { vi } from "date-fns/locale"
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle, Search, Plus, Calendar, User as UserIcon, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "../uiAdmin/scroll-area"
import { Badge } from "@/components/ui/badge"

// --- DỮ LIỆU MẪU ---
const MOCK_USERS = [
  { id: 1, name: "Nguyễn Đức Anh", role: "ADMIN", avatar: "" },
  { id: 2, name: "Trần Thị Bích", role: "STAFF", avatar: "" },
  { id: 3, name: "Lê Văn Cường", role: "STAFF", avatar: "" },
]

// Lưu ý mình đã đổi giờ để test hiệu ứng khối kéo dài
const MOCK_SCHEDULES = [
  { id: 101, userId: 1, startTime: new Date("2026-02-16T08:00:00"), endTime: new Date("2026-02-16T12:00:00"), status: "APPROVED" }, // 4 tiếng
  { id: 102, userId: 1, startTime: new Date("2026-02-18T13:30:00"), endTime: new Date("2026-02-18T17:45:00"), status: "PENDING" },  // 4 tiếng 15 phút
  { id: 103, userId: 2, startTime: new Date("2026-02-16T06:00:00"), endTime: new Date("2026-02-16T14:30:00"), status: "APPROVED" }, // 8 tiếng rưỡi
  { id: 104, userId: 1, startTime: new Date("2026-02-20T18:00:00"), endTime: new Date("2026-02-20T23:30:00"), status: "REJECTED" }, // 5.5 tiếng tối
]

// Cấu hình Timeline (6h sáng đến 12h đêm)
const START_HOUR = 6;
const END_HOUR = 24;
const HOUR_HEIGHT = 60; // Mỗi giờ cao 60px
const HOURS_ARRAY = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR);

export function AdminScheduleBoard() {
  const [currentDate, setCurrentDate] = useState(new Date("2026-02-16T00:00:00")) // Gắn cứng ngày để test Mock Data
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0])

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i))

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7))
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7))

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_USERS;
    return MOCK_USERS.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getSchedulesForSelectedUser = (day: Date) => {
    if (!selectedUser) return [];
    return MOCK_SCHEDULES.filter(
      (s) => s.userId === selectedUser.id && s.startTime.toDateString() === day.toDateString()
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

  // --- HÀM TÍNH TOÁN VỊ TRÍ VÀ ĐỘ DÀI CỦA KHỐI LỊCH ---
  const calculateBlockStyle = (startTime: Date, endTime: Date) => {
    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
    const endHour = endTime.getHours() + endTime.getMinutes() / 60;

    // Giới hạn trong khoảng 6:00 đến 24:00
    const clampedStart = Math.max(START_HOUR, Math.min(END_HOUR, startHour));
    const clampedEnd = Math.max(START_HOUR, Math.min(END_HOUR, endHour));

    const top = (clampedStart - START_HOUR) * HOUR_HEIGHT;
    const height = (clampedEnd - clampedStart) * HOUR_HEIGHT;

    return {
      top: `${top}px`,
      height: `${height}px`
    };
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-40px)] bg-gradient-to-br from-slate-100 to-slate-200 p-6 overflow-hidden">
      
      {/* Left Sidebar: User List */}
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

        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-3">
            {filteredUsers.map((user) => {
              const isActive = selectedUser?.id === user.id;
              return (
                <div
                  key={user.id} onClick={() => setSelectedUser(user)}
                  className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-colors duration-150 ${isActive ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'}`}
                >
                  <Avatar className="h-12 w-12 border-2 border-slate-200">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="font-semibold text-sm truncate text-slate-800">{user.name}</span>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs mt-1 w-fit">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right Side: Timeline */}
      <div className="flex-1 bg-white rounded-3xl shadow-2xl border border-slate-200/60 flex flex-col overflow-hidden backdrop-blur-sm">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-white to-slate-50 z-20">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Lịch trình: <span className="text-blue-600">{selectedUser?.name || "..."}</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">Timeline từ 06:00 đến 24:00</p>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Thêm lịch
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

    </div>
  )
}