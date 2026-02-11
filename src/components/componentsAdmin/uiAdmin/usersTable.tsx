"use client"

import React, { useEffect } from "react"
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
import { MoreHorizontal, Shield, User as UserIcon, Pencil, KeyRound, Trash2 } from "lucide-react"
import { useSelector, useDispatch } from "react-redux" // 1. Import hooks của Redux
import { RootState, AppDispatch } from "@/lib/store" // 2. Import kiểu dữ liệu Store
import { fetchUsersAPI } from "@/lib/features/userSlice" // 3. Import action gọi API
import { useSession } from "next-auth/react" // 4. Import session để lấy token
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton để hiển thị loading đẹp hơn
import { useGetUsersQuery } from "@/services/userApi"

export function UserTable() {
  const { data: users, isLoading, error } = useGetUsersQuery()

  if (error) return <div>Lỗi không tải được</div>


 

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

  // Xử lý error state
  if (error) {
    return <div className="text-red-500 p-4 border border-red-200 rounded">Error: {error}</div>
  }

  return (
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
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* 7. Render danh sách users từ Redux */}
          {users?.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/50">
              <TableCell>
                <Checkbox />
              </TableCell>

              {/* User Info */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    {/* Nếu API không trả về avatar, dùng placeholder */}
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
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
                  {/* Logic icon cho Role */}
                  {user.role === "ADMIN" ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                  {user.role}
                </Badge>
              </TableCell>

              {/* Date Added - Format lại ngày nếu cần */}
              <TableCell className="text-muted-foreground">
                {user.created_at ? new Date(user.created_at).toLocaleDateString("vi-VN") : "N/A"}
              </TableCell>

              {/* Status - Giả lập status vì API UserSlice hiện tại chưa có trường này */}
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
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4" /> View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" /> Edit Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
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
  )
}