"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Timer, Calendar as CalendarIcon, Clock, AlertCircle, Loader2, Plus, Trash2, CheckCircle2, Sun, Sunset, Moon, Save } from "lucide-react"
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



interface StagedShift {
  id: string | number;
  date: Date;
  startTime: string;
  endTime: string;
  note: string;
  isSaved?: boolean;
}

function RegisterScheduleForm() {
  const { data: session } = useSession()
  const currentUser = session?.user

  const searchParams = useSearchParams()
  const urlStart = searchParams.get('start')
  const urlEnd = searchParams.get('end')
  const urlClose = searchParams.get('close')
  const urlSettingId = searchParams.get('settingId')

  const hasUrlData = !!(urlStart && urlEnd && urlClose)

  const { data: settings, isLoading: isSettingsLoading } = useGetScheduleSettingsQuery()
  const [createSchedule, { isLoading: isSubmitting }] = useCreateScheduleMutation()
  const [deleteSchedule] = useDeleteScheduleMutation()

  const activeStart = hasUrlData ? urlStart! : settings?.shiftStartDate
  const activeEnd = hasUrlData ? urlEnd! : settings?.shiftEndDate
  const activeClose = hasUrlData ? urlClose! : settings?.closeTime
  const activeSettingId = hasUrlData ? Number(urlSettingId) : settings?.id

  const { data: allSchedules = [], isLoading: isSchedulesLoading } = useGetSchedulesQuery(
    { startDate: activeStart!, endDate: activeEnd! },
    { skip: !activeStart || !activeEnd }
  )

  const now = new Date()
  const deadline = activeClose ? parseISO(activeClose) : null
  const isClosed = hasUrlData ? (deadline && now > deadline) : (!settings || !settings.isOpen)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [note, setNote] = useState("")

  const [draftShifts, setDraftShifts] = useState<StagedShift[]>([])

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
        isSaved: true
      }));
  }, [allSchedules, currentUser?.id, activeSettingId]);

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

  const handleRemoveFromList = async (shift: StagedShift) => {
    if (shift.isSaved) {
      if (confirm("Bạn có chắc chắn muốn hủy ca làm đã nộp này khỏi hệ thống?")) {
        try {
          await deleteSchedule(shift.id as number).unwrap();
          toast.success("Đã hủy ca làm thành công!");
        } catch (e) {
          toast.error("Có lỗi xảy ra khi hủy ca làm.");
        }
      }
    } else {
      setDraftShifts(draftShifts.filter(s => s.id !== shift.id))
    }
  }

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
      setDraftShifts([])
    } catch (error: any) {
      toast.error(error?.data?.message || "Có lỗi xảy ra khi nộp, vui lòng thử lại!")
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans p-4 sm:p-6 lg:p-10 flex flex-col items-center">
      <div className="w-full max-w-6xl">

        {/* HEADER & BANNER */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Đăng ký ca làm</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">Lựa chọn ngày giờ và điều chỉnh lịch làm việc của bạn.</p>
        </div>

        <div className="mb-6 bg-white border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 sm:p-3 rounded-full text-blue-600 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Đợt đăng ký đang mở</h3>
              <p className="text-sm text-slate-600 flex flex-wrap items-center gap-2 mt-1">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                Chỉ áp dụng:
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {format(allowedStart, "dd/MM/yyyy")} - {format(allowedEnd, "dd/MM/yyyy")}
                </span>
              </p>
            </div>
          </div>
          <div className="bg-rose-50 px-5 py-2.5 rounded-xl border border-rose-100 text-center w-full sm:w-auto">
            <p className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider mb-1">Hạn chót nộp form</p>
            <p className="text-rose-700 font-bold text-lg flex items-center justify-center gap-2">
              <Timer className="w-4 h-4 animate-pulse" />
              {format(deadline!, "HH:mm - dd/MM")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* CỘT TRÁI: CALENDAR (Chiếm 4 phần) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center self-start">
            <div className="w-full flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-slate-800">Chọn ngày làm việc</h3>
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

          {/* CỘT PHẢI: FORM + DANH SÁCH (Chiếm 8 phần, gộp chung) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col self-start min-h-[500px]">

            {/* 1. KHU VỰC FORM NHẬP LIỆU (Thiết kế ngang, gọn gàng) */}
            <div className="border-b border-slate-100 pb-5 mb-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Cài đặt ca làm cho ngày:
                  <span className="text-blue-600 ml-1">{selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "..."}</span>
                </h3>


              </div>

              {/* Dàn ngang các ô Input */}
              <div className="flex flex-col sm:flex-row items-end gap-3">
                {/* Ô CHỌN TỪ GIỜ */}
                <div className="w-full sm:w-32 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Từ giờ</label>
                  <Select onValueChange={setStartTime} value={startTime}>
                    <SelectTrigger className="h-10 rounded-xl bg-slate-50/50">
                      <SelectValue placeholder="-- : --" />
                    </SelectTrigger>
                    {/* 👇 Thêm position="popper" và overflow-y-auto vào đây 👇 */}
                    <SelectContent position="popper" className="!max-h-[160px] min-w-[120px] overflow-y-auto">
                      {TIME_SLOTS.map(t => (
                        <SelectItem key={`start-${t}`} value={t} className="cursor-pointer">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ô CHỌN ĐẾN GIỜ */}
                <div className="w-full sm:w-32 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Đến giờ</label>
                  <Select onValueChange={setEndTime} value={endTime}>
                    <SelectTrigger className="h-10 rounded-xl bg-slate-50/50">
                      <SelectValue placeholder="-- : --" />
                    </SelectTrigger>
                    {/* 👇 Thêm position="popper" và overflow-y-auto vào đây 👇 */}
                    <SelectContent position="popper" className="!max-h-[160px] min-w-[120px] overflow-y-auto">
                      {TIME_SLOTS.map(t => (
                        <SelectItem key={`end-${t}`} value={t} className="cursor-pointer">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Ghi chú</label>
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú thêm (VD: Xin đi trễ 30p)..."
                    className="h-10 rounded-xl bg-slate-50/50"
                  />
                </div>

                <Button
                  onClick={handleAddToList}
                  className="text-white! w-full sm:w-auto h-10 rounded-xl bg-slate-900  hover:bg-slate-800 font-bold px-5"
                >
                  <Plus className=" w-4 h-4 mr-1.5" /> Thêm
                </Button>
              </div>
            </div>

            {/* 2. KHU VỰC DANH SÁCH (Có Scroll cố định chiều cao) */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Danh sách ca làm ({displayShifts.length})
                </h3>
              </div>

              {/* Vùng Scroll chính, khống chế chiều cao max 350px */}
              <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-100 p-2 overflow-y-auto custom-scrollbar max-h-[350px]">
                {displayShifts.length === 0 ? (
                  <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-slate-400 gap-2">
                    <CalendarIcon className="w-10 h-10 opacity-30" />
                    <p className="text-sm">Chưa có ca làm nào được chọn.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {displayShifts.map((shift) => (
                      <div
                        key={shift.id}
                        className={cn(
                          "flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border bg-white transition-all",
                          !shift.isSaved ? "border-amber-200 border-l-4 border-l-amber-400" : "border-slate-200 border-l-4 border-l-emerald-400"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-24 shrink-0">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Ngày</p>
                            <p className="font-bold text-slate-800 text-sm">{format(shift.date, "dd/MM", { locale: vi })}</p>
                          </div>

                          <div className="w-32 shrink-0 border-l border-slate-100 pl-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Thời gian</p>
                            <p className="font-bold text-slate-800 text-sm">{shift.startTime} - {shift.endTime}</p>
                          </div>


                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromList(shift as StagedShift)}
                          className="mt-2 sm:mt-0 h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 self-end sm:self-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. NÚT SUBMIT */}
            <div className="pt-5 mt-auto">
              <Button
                onClick={handleSubmitAll}
                disabled={draftShifts.length === 0 || isSubmitting}
                className={cn(
                  "w-full h-12 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2",
                  draftShifts.length === 0
                    ? "bg-slate-100 text-slate-400 hover:bg-slate-100"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
                )}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang gửi...</>
                ) : draftShifts.length === 0 ? (
                  <><Save className="w-5 h-5 mr-1" /> Không có ca chờ nộp</>
                ) : (
                  <><CheckCircle2 className="w-5 h-5 mr-1" /> Nộp ngay {draftShifts.length} ca mới</>
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