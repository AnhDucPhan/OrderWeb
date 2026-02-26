import React, { useMemo } from "react"
import { format } from "date-fns"
import { Calendar, CheckCircle2, Clock, Edit, Trash2 } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// ==============================================
// CẤU HÌNH TRỤC Y VÀ UI
// ==============================================
const START_HOUR = 6;
const END_HOUR = 23;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const HOURS_ARRAY = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => i + START_HOUR);

const CARD_WIDTH = 150;
const CARD_GAP = 12;

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED": return "bg-white border-emerald-500 shadow-sm"
    case "PENDING": return "bg-white border-slate-300 border-dashed shadow-sm"
    case "REJECTED": return "bg-white border-rose-400 shadow-sm opacity-70"
    default: return "bg-white border-slate-300 shadow-sm"
  }
}

// Tính toán tọa độ Y theo % (Đã bọc new Date để chống lỗi dữ liệu String từ API)
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
// THUẬT TOÁN ĐỈNH CAO: ZICZAC THEO "LÀN SÓNG" (WAVES)
// ==============================================
const processWaveSchedules = (schedules: any[]) => {
  if (!schedules || schedules.length === 0) return [];

  // 1. Sắp xếp các ca làm theo giờ bắt đầu từ sớm nhất
  const sorted = schedules.map(s => ({ ...s })).sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  const columnsMaxEndTime: number[] = [];
  
  let currentWaveStart = -1;
  let waveIndex = -1;

  sorted.forEach((s) => {
    const startTimestamp = new Date(s.startTime).getTime();
    const endTimestamp = new Date(s.endTime).getTime();

    // 2. NHẬN DIỆN LÀN SÓNG (CA LÀM):
    // Nếu đây là thẻ đầu tiên, HOẶC thẻ này bắt đầu sau thẻ mốc của làn sóng hiện tại > 3 tiếng
    // -> Ta coi nó là một "Ca mới" (Ví dụ từ ca sáng 6h chuyển sang ca chiều 12h)
    if (currentWaveStart === -1 || (startTimestamp - currentWaveStart) > 3 * 60 * 60 * 1000) {
      currentWaveStart = startTimestamp; // Cập nhật mốc giờ mới
      waveIndex++; // Tăng chỉ số làn sóng (0 -> 1 -> 2...)
    }

    // 3. XÁC ĐỊNH CỘT GỐC THEO LÀN SÓNG:
    // Làn sóng chẵn (Sáng, Tối) -> Bắt đầu từ Cột 0
    // Làn sóng lẻ (Chiều, Khuya) -> Bắt đầu từ Cột 1
    let baseCol = waveIndex % 2 === 0 ? 0 : 1;
    let targetCol = baseCol;

    // 4. CHỐNG ĐÈ CHỮ (Nhiều người làm cùng 1 ca):
    // Nếu Cột 0 đã có người, nhảy sang Cột 2, Cột 4... (Giữ nguyên phe Chẵn)
    // Nếu Cột 1 đã có người, nhảy sang Cột 3, Cột 5... (Giữ nguyên phe Lẻ)
    while (columnsMaxEndTime[targetCol] && startTimestamp < columnsMaxEndTime[targetCol]) {
      targetCol += 2; 
    }

    // Chốt vị trí thẻ
    s.column = targetCol;
    columnsMaxEndTime[targetCol] = endTimestamp;
  });

  return sorted;
}
interface ShiftDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftData: { date: Date, shiftName: string, schedules: any[] } | null;
  onEdit: (schedule: any) => void;
  onDelete: (scheduleId: number) => void;
}

export function ShiftDetailsModal({ isOpen, onClose, shiftData, onEdit, onDelete }: ShiftDetailsModalProps) {

  // Dùng thuật toán Làn sóng (Wave)
  const processedSchedules = useMemo(() => {
    return shiftData ? processWaveSchedules(shiftData.schedules) : [];
  }, [shiftData]);

  const containerMinWidth = useMemo(() => {
    if (processedSchedules.length === 0) return 0;
    const maxColumnIndex = Math.max(...processedSchedules.map(s => s.column));
    const totalColumns = maxColumnIndex + 1;
    // Tăng vùng chứa để các thẻ so le có chỗ hiển thị
    return (totalColumns * (CARD_WIDTH + CARD_GAP)) + CARD_GAP + 50;
  }, [processedSchedules]);

  if (!shiftData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-[95vw] md:w-[75vw] md:max-w-[75vw] h-[90vh] max-h-[95vh] bg-slate-50 flex flex-col p-0 overflow-hidden shadow-xl rounded-2xl border-none">

        {/* HEADER */}
        <DialogHeader className="px-5 py-3 border-b border-slate-200 bg-white z-40 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600 border border-blue-100">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-slate-800 leading-tight">
                  {shiftData.shiftName}
                </DialogTitle>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  Ngày {format(shiftData.date, "dd/MM/yyyy")}
                </p>
              </div>
            </div>

            <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider opacity-90">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã duyệt
              </span>
              <span className="flex items-center gap-1 text-orange-700 bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-100">
                <Clock className="w-3.5 h-3.5" /> Chờ duyệt
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* BODY */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50 flex relative custom-scrollbar">

          {/* CỘT TRÁI */}
          <div className="sticky left-0 top-0 bottom-0 z-30 w-[55px] bg-white border-r border-slate-200 flex-shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.03)] py-4 h-full">
            <div className="relative w-full h-full">
              {HOURS_ARRAY.map((hour) => {
                const topPercent = ((hour - START_HOUR) / TOTAL_HOURS) * 100;
                return (
                  <div key={hour} className="absolute w-full" style={{ top: `${topPercent}%` }}>
                    <div className="absolute right-2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border text-slate-400 bg-white border-slate-100">
                      {`${hour.toString().padStart(2, '0')}:00`}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* VÙNG CHỨA LỊCH LÀM SO LE */}
          <div className="relative py-4 h-full" style={{ minWidth: `${Math.max(containerMinWidth, 600)}px` }}>
            <div className="relative w-full h-full">

              {/* Lưới ngang */}
              <div className="absolute inset-0 pointer-events-none">
                {HOURS_ARRAY.map((hour) => {
                  const topPercent = ((hour - START_HOUR) / TOTAL_HOURS) * 100;
                  return (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-b border-slate-200/60"
                      style={{ top: `${topPercent}%` }}
                    ></div>
                  )
                })}
              </div>

              {/* Các Thẻ Nhân Viên */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="relative h-full w-full pointer-events-auto">
                  {processedSchedules.map((schedule) => {
                    const user = schedule.user;
                    const timeStyle = calculateBlockStyle(schedule.startTime, schedule.endTime);
                    const leftPosition = (schedule.column * (CARD_WIDTH + CARD_GAP)) + CARD_GAP;

                    const fullStyle = {
                      ...timeStyle,
                      width: `${CARD_WIDTH}px`,
                      left: `${leftPosition}px`
                    };

                    return (
                      <div
                        key={schedule.id}
                        className={`absolute p-2.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:z-20 overflow-hidden flex flex-col justify-between group ${getStatusColor(schedule.status)}`}
                        style={fullStyle}
                      >
                        <div className="flex justify-between items-start">
                          <Avatar className="h-8 w-8 border border-slate-200 shadow-sm flex-shrink-0">
                            <AvatarImage src={user?.avatar} className="object-cover" />
                            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
                              {user?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                            <Button size="icon" variant="ghost" className="h-6 w-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md" onClick={(e) => { e.stopPropagation(); onEdit(schedule); }}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6 bg-slate-100 hover:bg-rose-100 text-rose-600 rounded-md" onClick={(e) => { e.stopPropagation(); onDelete(schedule.id); }}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-1.5 text-slate-800">
                          <div className="font-bold text-sm leading-tight truncate" title={user?.name}>{user?.name}</div>
                          <div className="text-[9px] mt-0.5 font-bold text-slate-500 uppercase tracking-wider truncate">{user?.role}</div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center text-slate-600 mt-1">
                          <span className="flex items-center gap-1 font-bold text-[11px] truncate">
                            <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            {format(schedule.startTime, "HH:mm")} - {format(schedule.endTime, "HH:mm")}
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
      </DialogContent>
    </Dialog>
  )
}