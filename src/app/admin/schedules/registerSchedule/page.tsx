"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Timer, Calendar as CalendarIcon, Clock, ChevronRight, AlertCircle, Loader2, Plus, Trash2, CheckCircle2, Sun, Sunset, Moon, Save } from "lucide-react"
import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { useGetScheduleSettingsQuery, useCreateScheduleMutation, useGetSchedulesQuery, useDeleteScheduleMutation } from "@/services/scheduleApi"

const TIME_SLOTS = Array.from({ length: 36 }).map((_, i) => {
  const hours = Math.floor(i / 2) + 6; 
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
});

const PRESET_SHIFTS = [
  { label: "Ca Sáng", start: "08:00", end: "12:00", icon: Sun, color: "text-amber-500 bg-amber-50 border-amber-200 hover:bg-amber-100" },
  { label: "Ca Chiều", start: "13:00", end: "17:00", icon: Sunset, color: "text-orange-500 bg-orange-50 border-orange-200 hover:bg-orange-100" },
  { label: "Ca Tối", start: "18:00", end: "22:00", icon: Moon, color: "text-indigo-500 bg-indigo-50 border-indigo-200 hover:bg-indigo-100" },
]

interface StagedShift {
  id: string | number; 
  date: Date;
  startTime: string;
  endTime: string;
  note: string;
  isSaved?: boolean; // Cờ đánh dấu đã nộp thành công lên DB
}

function RegisterScheduleForm() {
  const { data: session } = useSession()
  const currentUser = session?.user

  // 1. ĐỌC DỮ LIỆU TỪ URL
  const searchParams = useSearchParams()
  const urlStart = searchParams.get('start')
  const urlEnd = searchParams.get('end')
  const urlClose = searchParams.get('close')
  const urlSettingId = searchParams.get('settingId') 

  const hasUrlData = !!(urlStart && urlEnd && urlClose)

  // 2. CÁC API HOOKS
  const { data: settings, isLoading: isSettingsLoading } = useGetScheduleSettingsQuery()
  const [createSchedule, { isLoading: isSubmitting }] = useCreateScheduleMutation()
  const [deleteSchedule] = useDeleteScheduleMutation() 

  // 3. XÁC ĐỊNH NGUỒN DỮ LIỆU (Khoảng thời gian)
  const activeStart = hasUrlData ? urlStart! : settings?.shiftStartDate
  const activeEnd = hasUrlData ? urlEnd! : settings?.shiftEndDate
  const activeClose = hasUrlData ? urlClose! : settings?.closeTime
  const activeSettingId = hasUrlData ? Number(urlSettingId) : settings?.id

  // 4. API LẤY LỊCH CŨ ĐÃ ĐĂNG KÝ
  const { data: allSchedules = [], isLoading: isSchedulesLoading } = useGetSchedulesQuery(
    { startDate: activeStart!, endDate: activeEnd! },
    { skip: !activeStart || !activeEnd }
  )

  const now = new Date()
  const deadline = activeClose ? parseISO(activeClose) : null
  const isClosed = hasUrlData ? (deadline && now > deadline) : (!settings || !settings.isOpen)

  // 5. CÁC STATE LƯU TRỮ FORM
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [note, setNote] = useState("")

  // State NÀY CHỈ DÙNG LƯU NHỮNG CA VỪA CHỌN (CHƯA NỘP)
  const [draftShifts, setDraftShifts] = useState<StagedShift[]>([])

  // 6. LỌC RA DANH SÁCH CA ĐÃ NỘP TRONG DB
  const savedShifts = useMemo(() => {
    if (!currentUser?.id || !activeSettingId) return [];
    
    return allSchedules
      .filter((s: any) => s.userId === Number(currentUser.id) && s.settingId === activeSettingId)
      .map((s: any) => ({
        id: s.id,
        date: new Date(s.startTime),
        startTime: format(new Date(s.startTime), "HH:mm"),
        endTime: format(new Date(s.endTime), "HH:mm"),
        note: s.note || "",
        isSaved: true // Đánh dấu là đã nộp thành công
      }));
  }, [allSchedules, currentUser?.id, activeSettingId]);

  // GỘP 2 DANH SÁCH LẠI ĐỂ HIỂN THỊ TRÊN UI
  const displayShifts = [...savedShifts, ...draftShifts].sort((a, b) => a.date.getTime() - b.date.getTime());

  useEffect(() => {
    if (!isClosed && activeStart) {
      setSelectedDate(parseISO(activeStart))
    }
  }, [isClosed, activeStart])

  if (!hasUrlData && (isSettingsLoading || isSchedulesLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FE] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">Đang tải biểu mẫu đăng ký...</p>
      </div>
    )
  }

  if (isClosed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE] p-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center max-w-md">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Đã hết hạn đăng ký</h2>
          <p className="text-slate-500">Đợt đăng ký ca làm này đã đóng hoặc quá hạn. Vui lòng liên hệ Quản lý nếu bạn cần hỗ trợ thêm.</p>
        </div>
      </div>
    )
  }

  const allowedStart = parseISO(activeStart!)
  const allowedEnd = parseISO(activeEnd!)

  // HÀM 1: THÊM CA LÀM NHÁP
  const handleAddToList = () => {
    if (!selectedDate || !startTime || !endTime) {
      toast.error("Vui lòng điền đầy đủ ngày và giờ làm việc!")
      return
    }
    if (startTime >= endTime) {
      toast.error("Giờ kết thúc phải sau giờ bắt đầu!")
      return
    }

    const isOverlap = displayShifts.some(shift =>
      shift.date.getTime() === selectedDate.getTime() &&
      ((startTime >= shift.startTime && startTime < shift.endTime) ||
        (endTime > shift.startTime && endTime <= shift.endTime) ||
        (startTime <= shift.startTime && endTime >= shift.endTime))
    )

    if (isOverlap) {
      toast.error("Ca làm này bị trùng với một ca khác bạn đã đăng ký hoặc đang nháp!")
      return
    }

    const newShift: StagedShift = {
      id: Math.random().toString(36).substring(2, 9),
      date: selectedDate,
      startTime,
      endTime,
      note,
      isSaved: false
    }

    setDraftShifts([...draftShifts, newShift])
    toast.success("Đã thêm vào danh sách chờ nộp")

    setStartTime("")
    setEndTime("")
    setNote("")
  }

  // HÀM 2: XÓA CA LÀM (NHÁP HOẶC ĐÃ NỘP)
  const handleRemoveFromList = async (shift: StagedShift) => {
    if (shift.isSaved) {
      // Hỏi ý kiến rồi gọi API xóa thực tế
      if (confirm("Bạn có chắc chắn muốn hủy ca làm đã nộp này khỏi hệ thống?")) {
        try {
          await deleteSchedule(shift.id as number).unwrap();
          toast.success("Đã hủy ca làm thành công!");
        } catch (e) {
          toast.error("Có lỗi xảy ra khi hủy ca làm.");
        }
      }
    } else {
      // Chỉ xóa khỏi danh sách nháp
      setDraftShifts(draftShifts.filter(s => s.id !== shift.id))
    }
  }

  // HÀM 3: GỬI CA NHÁP LÊN BACKEND
  const handleSubmitAll = async () => {
    if (draftShifts.length === 0) return

    try {
      const promises = draftShifts.map(shift => {
        const dateStr = format(shift.date, "yyyy-MM-dd")
        const finalStartTime = new Date(`${dateStr}T${shift.startTime}:00`).toISOString()
        const finalEndTime = new Date(`${dateStr}T${shift.endTime}:00`).toISOString()

        return createSchedule({
          userId: Number(currentUser?.id),
          startTime: finalStartTime,
          endTime: finalEndTime,
          note: shift.note,
          settingId: activeSettingId 
        }).unwrap()
      })

      await Promise.all(promises)

      toast.success(`Đã nộp thành công thêm ${draftShifts.length} ca làm!`)
      setDraftShifts([]) // Gửi xong thì xóa nháp, React sẽ tự tải lại danh sách đã nộp

    } catch (error: any) {
      toast.error(error?.data?.message || "Có lỗi xảy ra khi nộp, vui lòng thử lại!")
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans p-4 sm:p-6 lg:p-10 flex flex-col items-center">
      <div className="w-full max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Đăng ký ca làm</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">Lựa chọn ngày giờ và điều chỉnh lịch làm việc của bạn.</p>
        </div>

        {/* BANNER THÔNG TIN */}
        <div className="mb-8 bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-blue-50 p-2 sm:p-3 rounded-full text-blue-600 shrink-0">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">Đợt đăng ký đang mở</h3>
              <p className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                Chỉ áp dụng:
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {format(allowedStart, "dd/MM/yyyy")} - {format(allowedEnd, "dd/MM/yyyy")}
                </span>
              </p>
            </div>
          </div>
          <div className="bg-rose-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-rose-100 text-center w-full sm:w-auto shrink-0">
            <p className="text-[10px] sm:text-xs font-semibold text-rose-500 uppercase tracking-wider mb-1">Hạn chót nộp form</p>
            <p className="text-rose-700 font-bold text-base sm:text-lg flex items-center justify-center gap-2">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              {format(deadline!, "HH:mm - dd/MM")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* CỘT TRÁI: CALENDAR */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center self-start">
            <div className="w-full flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-slate-800">Chọn ngày</h3>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              defaultMonth={allowedStart}
              disabled={{ before: allowedStart, after: allowedEnd }}
              locale={vi}
              className="p-0 w-full flex justify-center"
              classNames={{
                months: "w-full flex flex-col",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center mb-4",
                caption_label: "text-sm font-bold text-slate-900",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full justify-between mb-2",
                head_cell: "text-slate-500 rounded-md w-full font-medium text-[0.8rem]",
                row: "flex w-full justify-between mt-2",
                cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20 h-10 w-full",
                day: "h-10 w-10 mx-auto p-0 font-medium aria-selected:opacity-100 rounded-full hover:bg-slate-100 transition-colors text-slate-700",
                day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white font-bold shadow-md",
                day_disabled: "text-slate-200 opacity-50 hover:bg-transparent cursor-not-allowed",
                day_outside: "text-slate-200 opacity-50",
              }}
            />
          </div>

          {/* CỘT GIỮA: CHỌN GIỜ */}
          {/* 👇 Đổi h-full thành h-fit 👇 */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col self-start h-fit">
            <div className="space-y-6 flex-1">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Cài đặt khung giờ
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Ngày chọn: <span className="font-semibold text-blue-600">{selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "Chưa chọn"}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Chọn ca nhanh</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_SHIFTS.map((preset) => {
                    const Icon = preset.icon
                    const isActive = startTime === preset.start && endTime === preset.end
                    return (
                      <button
                        key={preset.label}
                        onClick={() => { setStartTime(preset.start); setEndTime(preset.end); }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-all duration-200",
                          isActive ? "ring-2 ring-offset-1 ring-blue-500 border-transparent shadow-sm" : preset.color
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-bold">{preset.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Từ giờ</label>
                  <Select onValueChange={setStartTime} value={startTime}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 text-slate-700 font-medium focus:ring-blue-500">
                      <SelectValue placeholder="-- : --" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[220px] min-w-[220px]">
                      <div className="grid grid-cols-3 gap-1 p-1">
                        {TIME_SLOTS.map(t => (
                          <SelectItem key={`start-${t}`} value={t} className="justify-center rounded-lg cursor-pointer">
                            {t}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Đến giờ</label>
                  <Select onValueChange={setEndTime} value={endTime}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 text-slate-700 font-medium focus:ring-blue-500">
                      <SelectValue placeholder="-- : --" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[220px] min-w-[220px]">
                      <div className="grid grid-cols-3 gap-1 p-1">
                        {TIME_SLOTS.map(t => (
                          <SelectItem key={`end-${t}`} value={t} className="justify-center rounded-lg cursor-pointer">
                            {t}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Ghi chú</label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Xin đi trễ 30p..."
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="pt-6 mt-auto">
              <Button
                onClick={handleAddToList}
                variant="outline"
                className="w-full h-12 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold"
              >
                <Plus className="w-5 h-5 mr-2" /> Thêm vào danh sách
              </Button>
            </div>
          </div>

          {/* CỘT PHẢI: DANH SÁCH CA LÀM */}
          {/* 👇 Đổi h-full thành h-fit 👇 */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col self-start h-fit min-h-[400px]">
            <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Danh sách đăng ký
                </h3>
                <p className="text-sm text-slate-500 mt-1">Tổng cộng: <span className="font-bold text-slate-800">{displayShifts.length}</span> ca</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 max-h-[300px] lg:max-h-[400px]">
              {displayShifts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3 py-10">
                  <div className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-sm">Bạn chưa đăng ký ca nào.</p>
                </div>
              ) : (
                displayShifts.map((shift) => (
                  <div 
                    key={shift.id} 
                    className={cn(
                      "group relative p-3 rounded-2xl border transition-all",
                      !shift.isSaved 
                        ? "bg-amber-50/40 border-amber-200"
                        : "bg-emerald-50/50 border-emerald-200"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-800 text-sm">
                            {format(shift.date, "EEEE, dd/MM", { locale: vi })}
                          </p>
                          {!shift.isSaved ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-600">CHỜ NỘP</span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600">ĐÃ ĐĂNG KÝ</span>
                          )}
                        </div>

                        <p className="text-slate-700 font-semibold text-base">
                          {shift.startTime} <span className="text-slate-400 font-normal">đến</span> {shift.endTime}
                        </p>
                        {shift.note && (
                          <p className="text-xs text-slate-500 mt-1 bg-white inline-block px-2 py-0.5 rounded border border-slate-100">
                            📝 {shift.note}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFromList(shift as StagedShift)}
                        className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-6 mt-auto border-t border-slate-50">
              <Button
                onClick={handleSubmitAll}
                disabled={draftShifts.length === 0 || isSubmitting} 
                className={cn(
                  "w-full h-14 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2",
                  draftShifts.length === 0 
                    ? "bg-slate-100 text-slate-400 shadow-none hover:bg-slate-100"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200/50"
                )}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang gửi...</>
                ) : draftShifts.length === 0 ? (
                  <><Save className="w-5 h-5 mr-1" /> Không có ca chờ nộp</>
                ) : (
                  <><CheckCircle2 className="w-5 h-5 mr-1" /> Nộp thêm {draftShifts.length} ca mới</>
                )}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function RegisterSchedulePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FE] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">Đang thiết lập biểu mẫu...</p>
      </div>
    }>
      <RegisterScheduleForm />
    </Suspense>
  )
}