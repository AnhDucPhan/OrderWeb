'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Import Select của shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { AddUserModal } from "../uiAdmin/AddUserModal"
import { useState, useEffect } from "react" 
import UserTable from "../uiAdmin/usersTable"

const UserManagementComp = () => {
    // 1. STATE CHO TÌM KIẾM
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // 👇 2. STATE CHO BỘ LỌC ROLE VÀ STATUS
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // KỸ THUẬT DEBOUNCE
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);
    
    return (
        <div>
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">
                    Quản lý nhân viên
                </h2>
                <p className="text-muted-foreground">
                    Quản lý danh sách nhân sự và phân quyền tài khoản của họ tại đây.
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-4">
                <div className="font-semibold whitespace-nowrap">Tất cả nhân viên</div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    
                    {/* Ô Tìm Kiếm */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm tên, email..."
                            className="pl-8 bg-white"
                            value={searchInput} 
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    {/* Lọc Chức Vụ (Role) */}
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Chức vụ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả chức vụ</SelectItem>
                            <SelectItem value="Store Manager">Store Manager</SelectItem>
                            <SelectItem value="Shift Manager">Shift Manager</SelectItem>
                            <SelectItem value="Senior Barista">Senior Barista</SelectItem>
                            <SelectItem value="Barista">Barista</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Lọc Trạng Thái (Status) */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="Active">Hoạt động</SelectItem>
                            <SelectItem value="Inactive">Ngừng hoạt động</SelectItem>
                        </SelectContent>
                    </Select>

                    <div>
                        <AddUserModal />
                    </div>
                </div>
            </div>
            
            <div className="mt-4">
                {/* 👇 TRUYỀN TẤT CẢ STATE XUỐNG BẢNG */}
                <UserTable 
                  searchTerm={debouncedSearch} 
                  roleFilter={roleFilter === "all" ? undefined : roleFilter}
                  statusFilter={statusFilter === "all" ? undefined : statusFilter}
                />
            </div>
        </div>
    )
}

export default UserManagementComp;