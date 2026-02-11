"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User } from "@/services/userApi" // Import type User
import { Mail, Phone, Calendar, Shield, User as UserIcon, CheckCircle2 } from "lucide-react"

interface ViewUserModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export function ViewUserModal({ user, open, onClose }: ViewUserModalProps) {
  if (!user) return null; // Không có user thì không render gì cả

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hồ sơ nhân viên</DialogTitle>
          <DialogDescription>Chi tiết thông tin tài khoản.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* 1. Avatar Lớn */}
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            {user.avatar ? (
                <AvatarImage src={`http://localhost:8386/uploads/${user.avatar}`} className="object-cover" />
            ) : (
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
            )}
            <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* 2. Tên & Role */}
          <div className="text-center">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
               <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"} className="uppercase">
                  {user.role}
               </Badge>
               <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Active
               </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* 3. Thông tin chi tiết */}
        <div className="space-y-4 mt-2">
            
            {/* Email */}
            <div className="grid grid-cols-3 items-center gap-4">
               <div className="flex items-center text-sm font-medium text-muted-foreground col-span-1">
                  <Mail className="w-4 h-4 mr-2" /> Email
               </div>
               <div className="col-span-2 text-sm font-medium">{user.email}</div>
            </div>

            {/* Phone */}
            <div className="grid grid-cols-3 items-center gap-4">
               <div className="flex items-center text-sm font-medium text-muted-foreground col-span-1">
                  <Phone className="w-4 h-4 mr-2" /> SĐT
               </div>
               <div className="col-span-2 text-sm font-medium">{user.phoneNumber || "Chưa cập nhật"}</div>
            </div>

            {/* ID */}
            <div className="grid grid-cols-3 items-center gap-4">
               <div className="flex items-center text-sm font-medium text-muted-foreground col-span-1">
                  <Shield className="w-4 h-4 mr-2" /> ID
               </div>
               <div className="col-span-2 text-sm font-medium">#{user.id}</div>
            </div>

            {/* Ngày tạo */}
            <div className="grid grid-cols-3 items-center gap-4">
               <div className="flex items-center text-sm font-medium text-muted-foreground col-span-1">
                  <Calendar className="w-4 h-4 mr-2" /> Ngày tạo
               </div>
               <div className="col-span-2 text-sm font-medium">
                  {user.created_at 
                    ? new Date(user.created_at).toLocaleDateString("vi-VN", {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      }) 
                    : "N/A"}
               </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}