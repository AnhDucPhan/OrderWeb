"use client"

import { useState } from "react"
import { BellRing, Loader2, CalendarIcon, Clock, CalendarDays, ClockAlert } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// 👇 1. ĐỔI IMPORT: Lấy hook từ scheduleApi thay vì notificationApi
import { useOpenScheduleSettingMutation } from "@/services/scheduleApi" 

// Tạo danh sách giờ (mỗi 30 phút)
const TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => {
  const hours = Math.floor(i / 2).toString().padStart(2, "0")
  const minutes = i % 2 === 0 ? "00" : "30"
  return `${hours}:${minutes}`
})

// Định nghĩa bộ Validate bằng Zod
const formSchema = z.object({
  deadlineDate: z.date({ required_error: "Vui lòng chọn ngày chót." }),
  deadlineTime: z.string({ required_error: "Vui lòng chọn giờ." }),
  shiftStartDate: z.date({ required_error: "Vui lòng chọn ngày bắt đầu." }),
  shiftEndDate: z.date({ required_error: "Vui lòng chọn ngày kết thúc." }),
}).refine((data) => data.shiftStartDate <= data.shiftEndDate, {
  message: "Ngày kết thúc không được nhỏ hơn ngày bắt đầu",
  path: ["shiftEndDate"],
})

interface BroadcastModalProps {
  isManager?: boolean 
}

export default function BroadcastScheduleModal({ isManager = true }: BroadcastModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // State quản lý việc đóng/mở 3 cái lịch
  const [isDeadlineOpen, setIsDeadlineOpen] = useState(false)
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

  // 👇 2. ĐỔI TÊN HOOK: Sử dụng API Nhạc trưởng mới tạo
  const [openScheduleSetting, { isLoading: isBroadcasting }] = useOpenScheduleSettingMutation()

  // Khởi tạo Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deadlineTime: "23:59", 
    },
  })

  // Xử lý Submit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Ép kiểu Date + Time cho cái Deadline
      const dateStr = format(values.deadlineDate, "yyyy-MM-dd")
      const closeDateTime = new Date(`${dateStr}T${values.deadlineTime}:00`)

      // Ép kiểu giờ cho ngày kết thúc thành 23:59:59
      const endStr = format(values.shiftEndDate, "yyyy-MM-dd")
      const shiftEndDateTime = new Date(`${endStr}T23:59:59`)

      // 👇 3. GỌI HÀM TỪ HOOK MỚI
      await openScheduleSetting({
        closeTime: closeDateTime.toISOString(),
        shiftStartDate: values.shiftStartDate.toISOString(),
        shiftEndDate: shiftEndDateTime.toISOString(),
      }).unwrap()

      toast.success("Đã thiết lập cấu hình và phát thông báo mở ca thành công!")
      setIsOpen(false)
      form.reset() 
    } catch (error: any) {
      toast.error(error?.data?.message || "Lỗi khi mở cổng đăng ký")
    }
  }

  if (!isManager) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700 font-medium">
          <BellRing className="w-4 h-4 mr-2" />
          Mở đăng kí ca
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-500" />
            Cấu hình mở cổng đăng ký
          </DialogTitle>
          <DialogDescription>
            Thiết lập thời gian nhân viên nộp form và đăng ký ca làm.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            
            {/* ---------------- MỐC 1: DEADLINE ---------------- */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-slate-800 font-semibold border-b pb-2">
                <ClockAlert className="w-4 h-4 text-rose-500" />
                1. Hạn chót nộp Form
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {/* Chọn ngày chót */}
                <FormField control={form.control} name="deadlineDate" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày khóa cổng <span className="text-red-500">*</span></FormLabel>
                    <Popover open={isDeadlineOpen} onOpenChange={setIsDeadlineOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("pl-3 text-left font-normal bg-slate-50 hover:bg-slate-100", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày...</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); setIsDeadlineOpen(false) }} locale={vi} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Chọn giờ chót */}
                <FormField control={form.control} name="deadlineTime" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ khóa cổng <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-50">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <SelectValue placeholder="Chọn giờ" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" side="bottom" className="max-h-[200px] overflow-y-auto">
                        {TIME_SLOTS.map(time => (
                          <SelectItem key={`dl-${time}`} value={time}>{time}</SelectItem>
                        ))}
                        <SelectItem value="23:59">23:59 (Cuối ngày)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* ---------------- MỐC 2: KHOẢNG THỜI GIAN LÀM VIỆC ---------------- */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-slate-800 font-semibold border-b pb-2">
                <CalendarDays className="w-4 h-4 text-blue-500" />
                2. Khoảng thời gian làm việc
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {/* Ngày bắt đầu đợt làm việc */}
                <FormField control={form.control} name="shiftStartDate" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Từ ngày <span className="text-red-500">*</span></FormLabel>
                    <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("pl-3 text-left font-normal bg-slate-50 hover:bg-slate-100", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "dd/MM/yyyy") : <span>Bắt đầu...</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); setIsStartOpen(false) }} locale={vi} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Ngày kết thúc đợt làm việc */}
                <FormField control={form.control} name="shiftEndDate" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Đến ngày <span className="text-red-500">*</span></FormLabel>
                    <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("pl-3 text-left font-normal bg-slate-50 hover:bg-slate-100", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "dd/MM/yyyy") : <span>Kết thúc...</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); setIsEndOpen(false) }} locale={vi} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isBroadcasting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isBroadcasting} className="bg-amber-500 hover:bg-amber-600 text-white">
                {isBroadcasting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BellRing className="w-4 h-4 mr-2" />}
                Xác nhận Mở Cổng
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}