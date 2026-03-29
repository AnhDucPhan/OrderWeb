"use client"

import React, { useState, useEffect } from "react"
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
import { MoreHorizontal, Shield, User as UserIcon, Pencil, Trash2, Briefcase, Ban, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {  useGetUsersQuery, User } from "@/services/userApi"
import { useDeleteUserMutation, useUpdateUserMutation } from "@/services/userApi"
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
import EditUserModal from "./EditUserModal"

interface UserTableProps {
  searchTerm?: string;
  roleFilter?: string;
  statusFilter?: string;
}

const UserTable = ({ searchTerm = "", roleFilter = "", statusFilter = "" }: UserTableProps) => {
  // --- STATE QUẢN LÝ PHÂN TRANG ---
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, roleFilter, statusFilter]);
  
  const { data: responseData, isLoading, error } = useGetUsersQuery({ 
    page, 
    perPage, 
    q: searchTerm,
    role: roleFilter,
    status: statusFilter
  });

  // Bóc tách dữ liệu từ cấu trúc PaginatedResult của Backend
  const usersList: User[] = responseData?.data || [];
  const meta = responseData?.meta;

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteId, setDeleteId] = useState<number | string | null>(null)
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [viewingUser, setViewingUser] = useState<User | null>(null)

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

  if (error) {
    return <div className="text-red-500 p-4 border border-red-200 rounded">Lỗi tải danh sách nhân viên</div>
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      await deleteUser(deleteId).unwrap()
      toast.success("Đã xóa nhân viên thành công!")
      setDeleteId(null)
      // Nếu xóa user cuối cùng của trang hiện tại, tự động lùi về trang trước
      if (usersList.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      toast.error("Xóa thất bại (Có thể do lỗi mạng)")
    }
  }

  const handleToggleStatus = async (user: User) => {
    const formData = new FormData();
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    formData.append("status", newStatus);
    try {
      await updateUser({ id: user.id, formData }).unwrap();
      toast.success(`Đã chuyển trạng thái thành: ${newStatus}`);
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  }

  return (
    <>
      <div className="rounded-md border bg-white shadow-sm my-3 flex flex-col">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Chức Vụ</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {usersList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Không tìm thấy dữ liệu.
                </TableCell>
              </TableRow>
            ) : (
              usersList.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox />
                  </TableCell>

                  {/* User Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
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
                    <Badge variant="outline" className="flex w-fit items-center gap-1 font-normal">
                      {user.role === "ADMIN" ? (
                        <Shield className="h-3 w-3 text-blue-600" />
                      ) : (
                        <Briefcase className="h-3 w-3 text-slate-500" />
                      )}
                      {user.position || "Chưa cập nhật"}
                    </Badge>
                  </TableCell>

                  {/* Date Added */}
                  <TableCell className="text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {user.status === "Active" ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge className="bg-red-500" variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setViewingUser(user)}>
                          <UserIcon className="mr-2 h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                          {user.status === "Active" ? (
                            <>
                              <Ban className="mr-2 h-4 w-4 text-orange-500" />
                              <span className="text-orange-500">Vô hiệu hóa</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              <span className="text-green-600">Kích hoạt lại</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => setDeleteId(user.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* --- GIAO DIỆN PHÂN TRANG (PAGINATION) --- */}
        {meta && meta.lastPage > 1 && (
          <div className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị <span className="font-medium">{(meta.currentPage - 1) * meta.perPage + 1}</span> - <span className="font-medium">{Math.min(meta.currentPage * meta.perPage, meta.total)}</span> trong tổng số <span className="font-medium">{meta.total}</span> nhân sự
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!meta.prev}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Trước
              </Button>
              <div className="text-sm font-medium mx-2">
                Trang {meta.currentPage} / {meta.lastPage}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(meta.lastPage, p + 1))}
                disabled={!meta.next}
              >
                Tiếp <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <EditUserModal open={!!editingUser} user={editingUser} onClose={() => setEditingUser(null)} />
      <ViewUserModal open={!!viewingUser} user={viewingUser} onClose={() => setViewingUser(null)} />

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
                e.preventDefault()
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

export default UserTable