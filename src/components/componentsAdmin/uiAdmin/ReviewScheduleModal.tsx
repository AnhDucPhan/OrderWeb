"use client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Calendar as CalendarIcon, Clock, User as UserIcon } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

// 👇 ĐỔI SANG API CỦA SCHEDULE
import { useUpdateScheduleMutation } from "@/services/scheduleApi" 
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Schema đơn giản chỉ lấy Trạng thái và Ghi chú
const reviewSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"], {
        required_error: "Vui lòng chọn trạng thái",
    }),
    note: z.string().optional(),
})

interface ReviewProps {
    schedule: any | null; // Nhận cục data của ca làm vào đây
    open: boolean;
    onClose: () => void;
}

const ReviewScheduleModal = ({ schedule, open, onClose }: ReviewProps) => {
    // Gọi API updateSchedule thay vì updateUser
    const [updateSchedule, { isLoading }] = useUpdateScheduleMutation()

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            status: "PENDING",
            note: "",
        },
    })

    // Đổ dữ liệu cũ của ca làm vào form khi mở
    useEffect(() => {
        if (schedule && open) {
            form.reset({
                status: schedule.status || "PENDING",
                note: schedule.note || "",
            })
        }
    }, [schedule, open, form])

    async function onSubmit(values: z.infer<typeof reviewSchema>) {
        if (!schedule) return

        try {
            // Chỉ gửi lên Backend đúng 2 trường cần thiết
            await updateSchedule({ 
                id: schedule.id, 
                data: { 
                    status: values.status, 
                    note: values.note 
                } 
            }).unwrap()
            
            toast.success("Đã cập nhật trạng thái ca làm!")
            onClose()
        } catch (error: any) {
            console.error("Update Schedule Error:", error);
            toast.error(error?.data?.message || "Lỗi khi duyệt ca làm");
        }
    }

    // Xử lý hiển thị ngày giờ cho mượt
    const shiftDate = schedule?.startTime ? format(new Date(schedule.startTime), "EEEE, dd/MM/yyyy", { locale: vi }) : "";
    const startTimeStr = schedule?.startTime ? format(new Date(schedule.startTime), "HH:mm") : "";
    const endTimeStr = schedule?.endTime ? format(new Date(schedule.endTime), "HH:mm") : "";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Duyệt đăng ký ca làm</DialogTitle>
                </DialogHeader>
                
                {/* HIỂN THỊ THÔNG TIN CA LÀM ĐANG DUYỆT (Chỉ đọc) */}
                {schedule && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 mb-2">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <UserIcon className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold">Nhân viên:</span> 
                            <span className="font-bold text-slate-900">{schedule.user?.name || `ID: ${schedule.userId}`}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <CalendarIcon className="w-4 h-4 text-emerald-500" />
                            <span className="font-semibold">Ngày làm:</span> 
                            <span className="capitalize">{shiftDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold">Thời gian:</span> 
                            <span className="font-bold text-amber-600">{startTimeStr} - {endTimeStr}</span>
                        </div>
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        
                        {/* TRƯỜNG STATUS CỦA CA LÀM */}
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-slate-700">Trạng thái duyệt</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 border-slate-200">
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="PENDING" className="font-medium text-amber-600">⏳ Chờ duyệt (PENDING)</SelectItem>
                                        <SelectItem value="APPROVED" className="font-medium text-emerald-600">✅ Chấp nhận (APPROVED)</SelectItem>
                                        <SelectItem value="REJECTED" className="font-medium text-rose-600">❌ Từ chối (REJECTED)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* TRƯỜNG GHI CHÚ (Phản hồi lại cho nhân viên) */}
                        <FormField control={form.control} name="note" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-slate-700">Ghi chú / Phản hồi (Tùy chọn)</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        placeholder="Ví dụ: Đã đủ người ca này..." 
                                        className="h-12 border-slate-200"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter className="pt-2">
                            <Button 
                                variant="outline" 
                                type="button" 
                                onClick={onClose}
                                className="h-11"
                            >
                                Hủy bỏ
                            </Button>
                            <Button 
                                className="h-11 font-bold text-white bg-blue-600 hover:bg-blue-700 px-6" 
                                type="submit" 
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
                                Lưu trạng thái
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ReviewScheduleModal;