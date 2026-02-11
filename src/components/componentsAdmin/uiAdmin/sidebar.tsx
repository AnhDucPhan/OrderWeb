

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
    url: "#",
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
              <a href="#">
                {/* Icon đại diện (hoặc Logo nhỏ 32x32) */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" /> {/* Thay bằng Image logo nhỏ của bạn */}
                </div>

                {/* Tên App và Version */}
                <div className="grid flex-1 text-left text-sm leading-tight">
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
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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