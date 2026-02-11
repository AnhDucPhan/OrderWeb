"use client"

import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, User as UserIcon, Pencil, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetUsersQuery, User } from "@/services/userApi" // 👇 1. Import type User
import { EditUserModal } from "./EditUserModal" // 👇 2. Import Modal Sửa
import { useDeleteUserMutation } from "@/services/userApi"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ViewUserModal } from "./UserProfile"

export function UserTable() {
  const { data: users, isLoading, error } = useGetUsersQuery()

  // 👇 3. State quản lý user đang sửa (Null = đóng, Có data = mở)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteId, setDeleteId] = useState<number | string | null>(null)
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [viewingUser, setViewingUser] = useState<User | null>(null)

  // Xử lý loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return

    try {
      await deleteUser(deleteId).unwrap()
      toast.success("Đã xóa nhân viên thành công!")
      setDeleteId(null) // Đóng dialog
    } catch (error) {
      toast.error("Xóa thất bại (Có thể do lỗi mạng)")
    }
  }

  // Xử lý error state
  if (error) {
    return <div className="text-red-500 p-4 border border-red-200 rounded">Error loading users</div>
  }

  return (
    <>
      <div className="rounded-md border bg-white shadow-sm my-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox />
                </TableCell>

                {/* User Info */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      {user.avatar ? (
                        <AvatarImage src={`http://localhost:8386/uploads/${user.avatar}`} alt={user.name} />
                      ) : (
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                      )}
                      <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex w-fit items-center gap-1 font-normal"
                  >
                    {user.role === "ADMIN" ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                    {user.role}
                  </Badge>
                </TableCell>

                {/* Date Added */}
                <TableCell className="text-muted-foreground">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Active
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuItem onClick={() => setViewingUser(user)}>
                        <UserIcon className="mr-2 h-4 w-4" /> View Profile
                      </DropdownMenuItem>

                      {/* 👇 4. Gắn sự kiện mở modal vào đây */}
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Detail
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => setDeleteId(user.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 👇 5. Nhúng Modal vào cuối component */}
      <EditUserModal
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
      />

      <ViewUserModal 
        open={!!viewingUser}
        user={viewingUser}
        onClose={() => setViewingUser(null)}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tài khoản này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault() // Chặn đóng modal tự động để chờ API chạy xong
                handleConfirmDelete()
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xóa luôn"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}