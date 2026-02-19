

import { Calendar, Home, Inbox, Search, Settings, Users, Layers, Command } from "lucide-react"
import Image from 'next/image';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Items",
    url: "#",
    icon: Layers,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/admin/schedules",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },

]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className=""> {/* Thêm collapsible để test hiệu ứng đóng mở */}

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-3 p-2 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
                {/* Icon đại diện (hoặc Logo nhỏ 32x32) */}
                <div className="flex-shrink-0 w-10 flex items-center justify-center">
                  <div className="rounded-lg bg-sidebar-primary p-2 w-9 h-9 flex items-center justify-center">
                    <Command className="w-4 h-4 text-sidebar-primary-foreground" />
                  </div>
                </div>

                {/* Tên App và Version - ẩn khi collapsed */}
                <div className="hidden sm:flex flex-col text-left ml-2 group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Admin Panel</span>
                  <span className="truncate text-xs text-muted-foreground">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 2. Phần Menu bên dưới */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3 rounded-md p-2 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
                      <div className="flex-shrink-0 w-6 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-slate-700" />
                      </div>
                      <span className="ml-1 text-sm text-slate-800 hidden sm:inline-block group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}