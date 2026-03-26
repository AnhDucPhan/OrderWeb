"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import { useCreateUserMutation } from "@/services/userApi" 
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// 👇 Import lại các component của Select
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const addSchema = z.object({
  name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
  email: z.string().email(),
  position: z.string().min(1, "Vui lòng chọn chức vụ"), // Đổi thành position
  phoneNumber: z.string().min(8, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  avatar: z.any().optional(),
})

export function AddUserModal() {
  const [open, setOpen] = useState(false)
  const [createUser, { isLoading }] = useCreateUserMutation()

  const form = useForm<z.infer<typeof addSchema>>({
    resolver: zodResolver(addSchema),
    defaultValues: {
      name: "", email: "", password: "", position: "", phoneNumber: "",
    },
  })

  async function onSubmit(values: z.infer<typeof addSchema>) {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("email", values.email)
    formData.append("password", values.password)
    formData.append("position", values.position) 
    formData.append("phoneNumber", values.phoneNumber)
    
    if (values.avatar && values.avatar.length > 0) {
      formData.append("avatar", values.avatar[0])
    }

    try {
      await createUser(formData).unwrap()
      toast.success("Thêm nhân viên thành công!")
      form.reset()
      setOpen(false)
    } catch (error: any) {
      const errMessage = error?.data?.message;
      let displayMessage = "Lỗi khi thêm mới nhân viên"; // Lỗi mặc định
      if (Array.isArray(errMessage)) {
        // Nếu NestJS trả về mảng (lỗi Validation), ta lấy phần tử đầu tiên hoặc nối chúng lại
        displayMessage = errMessage[0]; 
      } else if (typeof errMessage === 'string') {
        // Nếu là chuỗi thì in ra bình thường
        displayMessage = errMessage;
      } else if (typeof errMessage === 'object') {
         // Nếu xui xẻo nó là một object kỳ lạ nào đó, ép nó thành string (JSON)
         displayMessage = JSON.stringify(errMessage);
      }

      // 3. Hiển thị toast an toàn
      toast.error(displayMessage);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-white!"><Plus className="mr-2 h-4 w-4" /> Thêm mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Thêm nhân viên</DialogTitle></DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <FormField control={form.control} name="name" render={({ field }) => (
                 <FormItem><FormLabel>Tên</FormLabel><FormControl><Input placeholder="Nguyễn Văn A" {...field} /></FormControl><FormMessage /></FormItem>
               )} />
               <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                 <FormItem><FormLabel>SĐT</FormLabel><FormControl><Input placeholder="0987654321" {...field} /></FormControl><FormMessage /></FormItem>
               )} />
            </div>

            <FormField control={form.control} name="email" render={({ field }) => (
                 <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="email@example.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="password" render={({ field }) => (
                 <FormItem><FormLabel>Mật khẩu</FormLabel><FormControl><Input type="password" placeholder="******" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            {/* 👇 Trường chức vụ dùng Select */}
            <FormField control={form.control} name="position" render={({ field }) => (
                <FormItem>
                    <FormLabel>Chức vụ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                         <FormControl>
                             <SelectTrigger>
                                 <SelectValue placeholder="Chọn chức vụ cho nhân viên" />
                             </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                             <SelectItem value="Store Manager">Store Manager </SelectItem>
                             <SelectItem value="Shift Manager">Shift Manager </SelectItem>
                             <SelectItem value="Senior Barista">Senior Barista </SelectItem>
                             <SelectItem value="Barista">Barista </SelectItem>
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
               <Button type="submit" className="text-white!" disabled={isLoading}>
                 {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                 {isLoading ? "Đang xử lý..." : "Tạo mới"}
               </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}