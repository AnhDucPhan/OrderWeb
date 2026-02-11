"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Loader2 } from "lucide-react" // Icon

// Import Shadcn UI components
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner" // Hoặc dùng thư viện toast bạn thích
import { useCreateUserMutation } from "@/services/userApi"

const formSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    role: z.enum(["ADMIN", "STAFF", "USER"]),
    phoneNumber: z.string().min(8, "Số điện thoại không hợp lệ"),
    avatar: z.any().optional(),
})
export function AddUserModal({ onSuccess }: { onSuccess?: () => void }) {
    const [open, setOpen] = useState(false) // Quản lý đóng mở modal

    const [createUser, { isLoading }] = useCreateUserMutation()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "USER",
            phoneNumber: "",
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("email", values.email)
        formData.append("password", values.password)
        formData.append("role", values.role)
        formData.append("phoneNumber", values.phoneNumber)
        try {
            // 👇 Gọi hàm createUser và unwrap để lấy kết quả hoặc bắt lỗi
            await createUser(formData).unwrap()

            toast.success("Tạo user thành công!")
            setOpen(false) // Đóng modal
            form.reset() // Reset form

            // ⚠️ ĐIỀU KỲ DIỆU: Không cần gọi onSuccess() hay fetchUsers() nữa!
            // RTK Query sẽ tự động làm mới danh sách bên ngoài.

        } catch (error: any) {
            toast.error(error?.data?.message || "Lỗi rồi đại vương ơi!")
        }
    }

    // Ref cho input file để reset sau khi upload
    const fileRef = form.register("avatar")

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);

                if (!isOpen) {
                    form.reset();
                }
            }}>
            <DialogTrigger asChild>
                <Button className="text-white!">
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Thêm nhân viên mới</DialogTitle>
                    <DialogDescription>
                        Điền đầy đủ thông tin để tạo tài khoản mới.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Tên */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ và tên</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email & Password (2 cột) */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input type="password"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Số điện thoại */}
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <FormControl>
                                        {/* Nhớ phải có {...field} nhé */}
                                        <Input placeholder="0912345678" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Role (Select) */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chức vụ</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn quyền" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ADMIN">Quản lý (Admin)</SelectItem>
                                            <SelectItem value="STAFF">Nhân viên (Staff)</SelectItem>
                                            <SelectItem value="USER">Khách hàng (User)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>Ảnh đại diện</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fieldProps} // 👈 QUAN TRỌNG: Thêm dòng này vào!
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => {
                                                onChange(event.target.files && event.target.files[0] ? event.target.files : null);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                className="text-white!"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}