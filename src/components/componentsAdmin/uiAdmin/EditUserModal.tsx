"use client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useUpdateUserMutation, User } from "@/services/userApi" // Hook sửa
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Schema sửa: Password optional
const editSchema = z.object({
    name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
    email: z.string().email(),
    role: z.enum(["ADMIN", "STAFF", "USER"]),
    phoneNumber: z.string().min(8),
    password: z.string().optional(), // 👈 KHÔNG BẮT BUỘC
    avatar: z.any().optional(),
})

interface EditProps {
    user: User | null; // Nhận user cần sửa
    open: boolean;
    onClose: () => void;
}

export function EditUserModal({ user, open, onClose }: EditProps) {
    const [updateUser, { isLoading }] = useUpdateUserMutation()

    const form = useForm<z.infer<typeof editSchema>>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            name: "", email: "", role: "USER", phoneNumber: "", password: "",
        },
    })

    // Đổ dữ liệu cũ vào form khi mở
    useEffect(() => {
        if (user && open) {
            form.reset({
                name: user.name,
                email: user.email,
                role: user.role as any,
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
        formData.append("role", values.role)
        formData.append("phoneNumber", values.phoneNumber)

        if (values.password) formData.append("password", values.password)
        if (values.avatar && values.avatar.length > 0) formData.append("avatar", values.avatar[0])

        try {
            await updateUser({ id: user.id, formData }).unwrap()
            toast.success("Cập nhật thành công!")
            onClose()
        } catch (error: any) {
            toast.error("Lỗi cập nhật")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader><DialogTitle>Sửa thông tin</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Các trường input tương tự AddModal, chỉ khác Password placeholder */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Tên</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                                <FormItem><FormLabel>SĐT</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem><FormLabel>Mật khẩu (Để trống nếu không đổi)</FormLabel><FormControl><Input type="password" placeholder="********" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chức vụ</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="STAFF">Staff</SelectItem>
                                        <SelectItem value="USER">User</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="avatar" render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                                <FormLabel>Avatar</FormLabel>
                                <FormControl>
                                    <Input {...fieldProps} type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0] ? e.target.files : null)} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : "Lưu thay đổi"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}