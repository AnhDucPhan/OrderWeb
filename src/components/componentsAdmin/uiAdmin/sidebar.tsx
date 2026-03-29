import { Calendar, Home, Inbox, Layers, Settings, Users, Command } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Nhân Sự", url: "/admin/users", icon: Users },
  { title: "Duyệt Công", url: "/admin/payroll-approval", icon: Layers },
  { title: "Duyệt Lương", url: "/admin/payroll", icon: Inbox },
  { title: "Duyệt lịch", url: "/admin/schedules", icon: Calendar },
  { title: "Sản Phẩm", url: "/admin/products", icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">

      {/* 1. Header (Logo & Tên App) */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                {/* Box chứa Icon */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                {/* Box chứa Text (Shadcn sẽ tự động làm mượt hiệu ứng ẩn/hiện cái grid này) */}
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
                  {/* 👇 Thêm tooltip để khi thu nhỏ, rê chuột vào icon sẽ hiện tên */}
                  <SidebarMenuButton asChild tooltip={item.title}>
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