"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Bell, CalendarClock, CalendarDays, ClockAlert, Clock } from "lucide-react" // Nhớ import thêm Clock
import { formatDistanceToNow, format } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Import API
import { useGetMyNotificationsQuery, useMarkAsReadMutation, Notification } from "@/services/notificationApi"
import { io } from "socket.io-client"
import { toast } from "sonner"

// HÀM PHỤ TRỢ: Lấy dòng text xem trước an toàn (tránh in ra chuỗi JSON xấu xí)
const getPreviewText = (messageStr: string) => {
  try {
    const data = JSON.parse(messageStr);
    return data.introText || data.text || messageStr;
  } catch {
    return messageStr;
  }
};

export default function NotificationBell() {
  const router = useRouter()
  const { data: notifications = [], refetch } = useGetMyNotificationsQuery(undefined, {
    pollingInterval: 10000, 
  })
  const [markAsRead] = useMarkAsReadMutation()

  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleOpenNotification = async (notif: Notification) => {
    setSelectedNotif(notif)
    if (!notif.isRead) {
      try {
        await markAsRead(notif.id).unwrap()
      } catch (error) {
        console.error("Lỗi khi đánh dấu đã đọc:", error)
      }
    }
  }

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8386');

    socket.on('newNotification', (data) => {
      toast.success(data.message || "Bạn có thông báo mới!");
      refetch();
    });

    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-full">
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0 mr-4 mt-2 shadow-lg rounded-xl overflow-hidden" align="end">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50/50">
            <h4 className="font-semibold text-sm text-slate-800">Thông báo nội bộ</h4>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {unreadCount} tin mới
              </span>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto flex flex-col">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
                <Bell className="w-8 h-8 text-slate-200" />
                Chưa có thông báo nào
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleOpenNotification(notif)}
                  className={cn(
                    "flex flex-col gap-1 p-4 border-b cursor-pointer transition-colors",
                    !notif.isRead ? "bg-blue-50/40 hover:bg-blue-50/60" : "opacity-75 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn("text-sm", !notif.isRead ? "font-semibold text-slate-900" : "font-medium text-slate-700")}>
                      {notif.title}
                    </span>
                    {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />}
                  </div>
                  
                  {/* 👇 ĐÃ SỬA: Bọc hàm getPreviewText để text bên ngoài luôn đẹp */}
                  <p className="text-xs text-slate-600 truncate">{getPreviewText(notif.message)}</p>
                  
                  <span className="text-[10px] text-slate-400 mt-1 font-medium">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                  </span>
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* 👇 BẢNG ĐỌC CHI TIẾT THÔNG BÁO (MODAL TEMPLATE) */}
      <Dialog open={!!selectedNotif} onOpenChange={(open) => !open && setSelectedNotif(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 bg-blue-50/50 border-b text-left">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <CalendarClock className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Thông báo hệ thống</span>
            </div>
            <DialogTitle className="text-lg leading-tight">
              {selectedNotif?.title}
            </DialogTitle>
            <span className="text-xs text-slate-500 mt-1 block">
              Gửi lúc: {selectedNotif ? format(new Date(selectedNotif.createdAt), "HH:mm - dd/MM/yyyy") : ""}
            </span>
          </DialogHeader>

          <div className="px-6 py-5 bg-slate-50 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {(() => {
              // 1. NHÁNH 1: MỞ CỔNG ĐĂNG KÝ
              if (selectedNotif?.type === 'SCHEDULE_OPEN') {
                try {
                  const data = JSON.parse(selectedNotif.message);
                  return (
                    <div className="space-y-4 text-sm text-slate-700">
                      <p className="font-medium text-slate-900">Quản lý đã mở cổng đăng ký ca làm cho đợt tiếp theo.</p>
                      <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm space-y-3">
                        {/* UI cũ của bạn */}
                        <div className="flex items-start gap-3">
                          <ClockAlert className="w-5 h-5 text-rose-500 mt-0.5" />
                          <div>
                            <p className="font-semibold text-rose-600">Hạn chót nộp form</p>
                            <p className="text-slate-600 font-medium">
                              {format(new Date(data.closeTime), "HH:mm - dd/MM/yyyy", { locale: vi })}
                            </p>
                          </div>
                        </div>
                        <div className="h-px bg-slate-100" />
                        <div className="flex items-start gap-3">
                          <CalendarDays className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-semibold text-blue-600">Thời gian làm việc áp dụng</p>
                            <p className="text-slate-600 font-medium">
                              Từ {format(new Date(data.shiftStartDate), "dd/MM/yyyy")} đến {format(new Date(data.shiftEndDate), "dd/MM/yyyy")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-amber-700 bg-amber-50 p-3 rounded text-xs leading-relaxed border border-amber-200">
                        <span className="font-bold">Lưu ý:</span> Vui lòng đăng ký ca làm đúng hạn. Các trường hợp nộp muộn hệ thống sẽ tự động từ chối!
                      </p>
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedNotif(null);
                            router.push(`/admin/schedules/registerSchedule?settingId=${data.settingId}&start=${data.shiftStartDate}&end=${data.shiftEndDate}&close=${data.closeTime}`);
                          }}
                          className="group flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Đăng ký ca làm ngay
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                } catch (e) {
                  return <div className="text-sm text-slate-700">{selectedNotif.message}</div>;
                }
              }

              // 👇 2. NHÁNH 2: GIAO DIỆN BẢNG CÔNG BỐ LỊCH (MỚI) 👇
              if (selectedNotif?.type === 'SCHEDULE_PUBLISHED') {
                try {
                  const data = JSON.parse(selectedNotif.message);
                  return (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-slate-700">{data.introText}</p>
                      <div className="overflow-hidden border border-emerald-200 rounded-xl shadow-sm">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-emerald-50 text-emerald-800 text-xs uppercase font-bold">
                            <tr>
                              <th scope="col" className="px-4 py-3 border-b border-emerald-100 flex items-center gap-2">
                                <CalendarDays className="w-4 h-4" /> Ngày làm việc
                              </th>
                              <th scope="col" className="px-4 py-3 border-b border-emerald-100">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" /> Thời gian ca
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-emerald-50 bg-white">
                            {data.shifts?.map((shift: any, index: number) => (
                              <tr key={index} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-semibold text-slate-700">
                                  {shift.dateStr}
                                </td>
                                <td className="px-4 py-3 font-bold text-emerald-600">
                                  {shift.timeStr}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                } catch (e) {
                  return <div className="text-sm text-slate-700">{selectedNotif.message}</div>;
                }
              }

              // 3. FALLBACK CHO CÁC LOẠI THÔNG BÁO BÌNH THƯỜNG KHÁC (Chỉ có text)
              return (
                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed p-4 bg-white rounded-lg border shadow-sm">
                  {getPreviewText(selectedNotif?.message || "")}
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}