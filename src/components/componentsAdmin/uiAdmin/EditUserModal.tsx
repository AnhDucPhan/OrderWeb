"use client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useUpdateUserMutation, User } from "@/services/userApi"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 👇 SỬA SCHEMA: Loại bỏ enum cũ của Role, chuyển position thành string
const editSchema = z.object({
    name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
    email: z.string().email(),
    position: z.string().min(1, "Vui lòng chọn chức vụ"), // Thay đổi ở đây
    phoneNumber: z.string().min(8, "SĐT tối thiểu 8 số"),
    password: z.string().optional(),
    avatar: z.any().optional(),
})

interface EditProps {
    user: User | null;
    open: boolean;
    onClose: () => void;
}

const EditUserModal = ({ user, open, onClose }: EditProps) => {
    const [updateUser, { isLoading }] = useUpdateUserMutation()

    const form = useForm<z.infer<typeof editSchema>>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            name: "", email: "", position: "", phoneNumber: "", password: "",
        },
    })

    // Đổ dữ liệu cũ vào form khi mở
    useEffect(() => {
        if (user && open) {
            form.reset({
                name: user.name || "",
                email: user.email || "",
                position: user.position || "", // Lấy đúng trường position
                phoneNumber: user.phoneNumber || "",
                password: "", // Pass để rỗng
            })
        }
    }, [user, open, form])

    async function onSubmit(values: z.infer<typeof editSchema>) {
        if (!user) return
        const formData = new FormData()

        formData.append("name", values.name)
        formData.append("email", values.email)
        formData.append("position", values.position) // Gửi position lên backend
        formData.append("phoneNumber", values.phoneNumber)

        if (values.password) {
            formData.append("password", values.password)
        }

        if (values.avatar instanceof File) {
            formData.append("avatar", values.avatar)
        }

        try {
            await updateUser({ id: user.id, formData }).unwrap()
            toast.success("Cập nhật thành công!")
            onClose()
        } catch (error: any) {
            console.error("Update Error:", error);
            
            // Xử lý thông báo lỗi an toàn chống crash
            const backendMessage = error?.data?.message;
            let displayMessage = "Lỗi khi cập nhật thông tin";

            if (typeof backendMessage === 'string') {
                displayMessage = backendMessage;
            } else if (Array.isArray(backendMessage)) {
                // NestJS thường trả về mảng các lỗi: ["position must be a string", ...]
                displayMessage = backendMessage[0]; 
            } else if (typeof backendMessage === 'object' && backendMessage !== null) {
                // Đề phòng trường hợp nó trả về object raw
                displayMessage = "Dữ liệu gửi lên không hợp lệ (400)";
            }

            toast.error(displayMessage);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader><DialogTitle>Sửa thông tin nhân sự</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Tên</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                                <FormItem><FormLabel>SĐT</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>
                        )} />

                        {/* 👇 TRƯỜNG POSITION: Đã được cập nhật value rõ ràng */}
                        <FormField control={form.control} name="position" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chức vụ</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="-- Chọn chức vụ --" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Store Manager">Store Manager</SelectItem>
                                        <SelectItem value="Shift Manager">Shift Manager</SelectItem>
                                        <SelectItem value="Senior Barista">Senior Barista</SelectItem>
                                        <SelectItem value="Barista">Barista</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>Avatar</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fieldProps}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                onChange(file || undefined);
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button className="text-white bg-blue-600 hover:bg-blue-700" type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Xác Nhận
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditUserModal;