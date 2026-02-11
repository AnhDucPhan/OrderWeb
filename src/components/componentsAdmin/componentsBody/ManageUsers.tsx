'use client'
import { Button } from "@/components/ui/button"
import { FacetedFilter } from "@/components/ui/data-table-faceted-filter"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Circle, User, Shield, Plus } from "lucide-react"
import { UserTable } from "../uiAdmin/usersTable"
import { AddUserModal } from "../uiAdmin/AddUserModal"

const UserManagementComp = () => {

    const roles = [
        { label: "Admin", value: "admin", icon: Shield },
        { label: "User", value: "user", icon: User },
        { label: "Guest", value: "guest", icon: Circle },
    ]

    const statuses = [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Banned", value: "banned" },
    ]
    return (
        <div>
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">
                    User Management
                </h2>
                <p className="text-muted-foreground">
                    Manage your team members and their account permissions here.
                </p>
            </div>
            <div className="flex items-center justify-between">
                <div className="font-semibold">All Users</div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full max-w-sm items-center">
                        {/* Icon kính lúp nằm tuyệt đối bên trái */}
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                        {/* Input có padding-left để chữ không đè lên icon */}
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-8 bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FacetedFilter title="Role" options={roles} />
                        <FacetedFilter title="Status" options={statuses} />
                    </div>
                    <div>
                        {/* 👇 XÓA nút Button cũ đi, thay bằng dòng này */}
                        <AddUserModal onSuccess={() => {
                            console.log("Reload lại bảng user tại đây")
                        }} />
                    </div>
                </div>

            </div>
            <div>
                <UserTable />
            </div>
        </div>
    )
}

export default UserManagementComp;