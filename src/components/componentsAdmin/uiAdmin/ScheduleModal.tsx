"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, CalendarClock, CalendarIcon, Clock, Edit, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import { User } from "@/services/userApi"
import { useCreateScheduleMutation, useUpdateScheduleMutation } from "@/services/scheduleApi"

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
};
const TIME_SLOTS = generateTimeSlots();

const scheduleSchema = z.object({
  userId: z.string().optional(),
  date: z.date({
    required_error: "Vui lòng chọn ngày làm việc",
  }),
  startTime: z.string().min(1, "Vui lòng chọn giờ bắt đầu"),
  endTime: z.string().min(1, "Vui lòng chọn giờ kết thúc"),
  note: z.string().optional(),
}).refine((data) => data.startTime < data.endTime, {
  message: "Giờ kết thúc phải sau giờ bắt đầu!",
  path: ["endTime"],
});

interface AddScheduleProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  defaultUserId?: string | number;
  editData?: any | null;
  isManager: boolean;
  currentUser: any;
}

export function AddScheduleModal({ open, onClose, users, defaultUserId, editData, isManager, currentUser }: AddScheduleProps) {
  const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation();
  const [updateSchedule, { isLoading: isUpdating }] = useUpdateScheduleMutation();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const isLoading = isCreating || isUpdating;
  const isEditMode = !!editData;
  
  // KIỂM TRA XEM CÓ PHẢI LÀ QUẢN LÝ ĐANG SỬA CA CHỜ DUYỆT KHÔNG
  const isPendingReview = isEditMode && isManager && editData?.status === 'PENDING';

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      userId: "",
      startTime: "06:30",
      endTime: "22:30",
      note: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (editData) {
        const startDate = new Date(editData.startTime);
        const endDate = new Date(editData.endTime);

        form.reset({
          userId: String(editData.userId),
          date: startDate, 
          startTime: format(startDate, "HH:mm"), 
          endTime: format(endDate, "HH:mm"),     
          note: editData.note || "",
        });
      } else {
        form.reset({
          userId: isManager ? "" : String(currentUser?.id),
          date: new Date(),
          startTime: "06:30",
          endTime: "22:30",
          note: "",
        });
      }
    }
  // 👇 ĐIỂM QUAN TRỌNG NHẤT LÀ Ở ĐÂY 👇
  // Đổi `editData` thành `editData?.id` để tránh việc RTK Query polling làm reset form
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editData?.id, defaultUserId, isManager, currentUser?.id]);
  async function onSubmit(values: z.infer<typeof scheduleSchema>) {
    if (isManager && !values.userId) {
      form.setError("userId", { type: "manual", message: "Vui lòng chọn nhân viên" });
      return;
    }

    const finalUserId = isManager ? Number(values.userId) : Number(currentUser?.id);

    if (!finalUserId || isNaN(finalUserId)) {
      toast.error("Hệ thống chưa tải xong thông tin người dùng, vui lòng thử lại!");
      return;
    }

    const year = values.date.getFullYear();
    const month = values.date.getMonth();
    const day = values.date.getDate();

    const [startHour, startMinute] = values.startTime.split(':').map(Number);
    const [endHour, endMinute] = values.endTime.split(':').map(Number);

    const startDateTime = new Date(year, month, day, startHour, startMinute).toISOString();
    const endDateTime = new Date(year, month, day, endHour, endMinute).toISOString();

    const payload: any = {
      userId: finalUserId, 
      startTime: startDateTime,
      endTime: endDateTime,
      note: values.note,
    }

    // 👇 NẾU QUẢN LÝ BẤM DUYỆT TRONG MODAL NÀY, ĐÍNH KÈM STATUS LÀ APPROVED
    if (isPendingReview) {
      payload.status = 'APPROVED';
    }

    try {
      if (isEditMode) {
        await updateSchedule({ id: editData.id, data: payload }).unwrap();
        toast.success(isPendingReview ? "Đã duyệt ca làm việc thành công!" : "Cập nhật lịch làm việc thành công!");
      } else {
        await createSchedule(payload).unwrap();
        toast.success("Đăng ký ca làm thành công!");
      }
      onClose();
    } catch (error: any) {
      console.error("Lỗi chi tiết từ API:", error?.data || error);
      const errMsg = error?.data?.message;
      if (Array.isArray(errMsg)) {
        toast.error(errMsg[0]); 
      } else {
        toast.error(errMsg || `Lỗi khi ${isEditMode ? 'cập nhật' : 'thêm'} ca làm việc`);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-[480px] p-4 sm:p-6 rounded-lg">

        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            {isPendingReview ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : isEditMode ? (
              <Edit className="w-5 h-5 text-blue-600 shrink-0" />
            ) : (
              <CalendarClock className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            
            {/* THAY ĐỔI TIÊU ĐỀ THEO TRẠNG THÁI */}
            {isPendingReview ? "Xem xét & Duyệt ca làm" : isEditMode ? "Chỉnh sửa lịch làm việc" : "Phân công ca làm việc"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {isPendingReview ? "Bạn có thể điều chỉnh lại giờ trước khi duyệt ca này." : isEditMode ? "Thay đổi thông tin ca làm việc của nhân viên." : "Chọn ngày và khung giờ làm việc cho nhân viên."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">

            {/* CHỈ HIỂN THỊ Ô CHỌN NHÂN VIÊN NẾU LÀ QUẢN LÝ */}
            <div className={isManager ? "block" : "hidden"}>
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhân sự phụ trách <span className="text-red-500">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      defaultValue={field.value}
                      disabled={isEditMode}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-50">
                          <SelectValue placeholder="-- Chọn nhân viên --" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users && users.length > 0 ? (
                          users.map((u) => (
                            <SelectItem key={u.id} value={String(u.id)}>
                              {u.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="empty" disabled>Không có nhân viên nào</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ngày Làm Việc */}
            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày làm việc <span className="text-red-500">*</span></FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-slate-50 hover:bg-slate-100",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày...</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsCalendarOpen(false);
                      }}
                      initialFocus
                      locale={vi}
                      classNames={{
                        day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                        day_today: "bg-slate-100 text-slate-900",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />

            {/* Khung Giờ */}   
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="startTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>Từ giờ <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-50">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <SelectValue placeholder="Bắt đầu" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper" side="bottom" className="max-h-[200px] overflow-y-auto">
                      {TIME_SLOTS.map(time => (
                        <SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="endTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>Đến giờ <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-50">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <SelectValue placeholder="Kết thúc" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper" side="bottom" className="max-h-[200px] overflow-y-auto">
                      {TIME_SLOTS.map(time => (
                        <SelectItem key={`end-${time}`} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Ghi chú */}
            <FormField control={form.control} name="note" render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú <span className="text-slate-400 font-normal text-xs">(Không bắt buộc)</span></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="VD: Trực quầy thu ngân..."
                    className="resize-none bg-slate-50 h-20 w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Hủy bỏ
              </Button>
              
              {/* 👇 ĐỔI MÀU & TEXT NÚT THEO TRẠNG THÁI */}
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full sm:w-auto ${isPendingReview ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                {isPendingReview ? "Lưu & Duyệt ca" : isEditMode ? "Lưu thay đổi" : "Lưu phân công"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}