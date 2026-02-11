'use client'
import { Button } from "@/components/ui/button"
import { FacetedFilter } from "@/components/ui/data-table-faceted-filter"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Circle, User as UserIcon, Shield, Plus } from "lucide-react"
import { UserTable } from "../uiAdmin/usersTable"
import { AddUserModal } from "../uiAdmin/AddUserModal"
import { useState } from "react"
import { useGetUsersQuery, User } from "@/services/userApi"

const UserManagementComp = () => {
    const [openModal, setOpenModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const handleCreate = () => {
        setSelectedUser(null) // Null = Add Mode
        setOpenModal(true)
    }

    const handleEdit = (user: User) => {
        setSelectedUser(user) // Có data = Edit Mode
        setOpenModal(true)
    }

    const roles = [
        { label: "Admin", value: "admin", icon: Shield },
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
                        <AddUserModal

                        />
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