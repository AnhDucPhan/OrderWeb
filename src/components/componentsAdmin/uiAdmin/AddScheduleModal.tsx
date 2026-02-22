"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, CalendarClock, CalendarIcon, Clock } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns" // Thư viện xử lý ngày tháng chuẩn đi kèm shadcn
import { vi } from "date-fns/locale" // Import để hiển thị lịch tiếng Việt (Tùy chọn)

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import { User } from "@/services/userApi"
import { useCreateScheduleMutation } from "@/services/scheduleApi"

// --- 1. HÀM TẠO DANH SÁCH GIỜ (Mỗi mốc cách nhau 30p) ---
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

// --- 2. VALIDATION SCHEMA TÁCH BIỆT ---
const scheduleSchema = z.object({
  userId: z.string().min(1, "Vui lòng chọn nhân viên"),
  date: z.date({
    required_error: "Vui lòng chọn ngày làm việc",
  }),
  startTime: z.string().min(1, "Vui lòng chọn giờ bắt đầu"),
  endTime: z.string().min(1, "Vui lòng chọn giờ kết thúc"),
  note: z.string().optional(),
}).refine((data) => {
  // Vì trong cùng 1 ngày, ta chỉ cần so sánh chuỗi giờ "07:30" < "08:00"
  return data.startTime < data.endTime;
}, {
  message: "Giờ kết thúc phải sau giờ bắt đầu!",
  path: ["endTime"],
});

interface AddScheduleProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  defaultUserId?: string | number;
}

export function AddScheduleModal({ open, onClose, users, defaultUserId }: AddScheduleProps) {
  const [createSchedule, { isLoading }] = useCreateScheduleMutation();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Quản lý trạng thái mở popover lịch
  
  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      userId: "",
      startTime: "08:00", // Để mặc định một giờ hợp lý cho tiện
      endTime: "17:30",
      note: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        userId: defaultUserId ? String(defaultUserId) : "",
        date: new Date(), // Mặc định gán ngày hôm nay
        startTime: "08:00",
        endTime: "17:30",
        note: "",
      })
    }
  }, [open, defaultUserId, form])

  async function onSubmit(values: z.infer<typeof scheduleSchema>) {
    // 3. GHÉP NGÀY VÀ GIỜ THÀNH CHUẨN ISO CHO BACKEND
    // Lấy Ngày, Tháng, Năm từ input date
    const year = values.date.getFullYear();
    const month = values.date.getMonth();
    const day = values.date.getDate();

    // Lấy Giờ, Phút từ input startTime / endTime
    const [startHour, startMinute] = values.startTime.split(':').map(Number);
    const [endHour, endMinute] = values.endTime.split(':').map(Number);

    // Tạo Object Date hoàn chỉnh và chuyển qua ISOString
    const startDateTime = new Date(year, month, day, startHour, startMinute).toISOString();
    const endDateTime = new Date(year, month, day, endHour, endMinute).toISOString();

    const payload = {
      userId: Number(values.userId),
      startTime: startDateTime,
      endTime: endDateTime,
      note: values.note,
    }

    try {
      await createSchedule(payload).unwrap();
      toast.success("Thêm ca làm việc thành công!");
      onClose();
    } catch (error: any) {
      console.error("Lỗi:", error);
      toast.error(error.data?.message || "Lỗi khi thêm ca làm việc");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-[480px] p-4 sm:p-6 rounded-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CalendarClock className="w-5 h-5 text-blue-600 shrink-0" />
            Phân công ca làm việc
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Chọn ngày và khung giờ làm việc cho nhân viên.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            
            {/* Nhân Viên */}
            <FormField control={form.control} name="userId" render={({ field }) => (
              <FormItem>
                <FormLabel>Nhân sự phụ trách <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-slate-50 w-full">
                      <SelectValue placeholder="-- Chọn nhân viên --" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map(u => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.name} - {u.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Ngày Làm Việc (Dùng Popover Lịch) */}
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
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày...</span>
                        )}
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
                        setIsCalendarOpen(false); // Chọn xong tự đóng lịch
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // KHÔNG CHO CHỌN NGÀY QUÁ KHỨ
                      initialFocus
                      locale={vi} // Nếu muốn tiếng Việt, nhớ import vi từ date-fns/locale
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />

            {/* Khung Giờ (Grid chia 2 cột) */}
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
                    <SelectContent className="h-48">
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
                    <SelectContent className="h-48">
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
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                Lưu phân công
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}