// components/componentsAdmin/uiAdmin/admin-header.tsx
'use client';

import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar'; // Nút đóng mở sidebar
import { Button, Avatar, Dropdown, MenuProps } from 'antd'; // Tận dụng Antd của bạn
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { signOut, useSession } from 'next-auth/react';

const AdminHeader = () => {
    const { data: session } = useSession();

    // Menu dropdown cho user
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div className="font-semibold">
                    {session?.user?.name || "Admin"}
                </div>
            ),
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            danger: true,
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: () => signOut({ callbackUrl: '/' }),
        },
    ];

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4 shadow-sm">
            <div className="flex items-center gap-2">
                {/* Nút Trigger sidebar sẽ nằm ở đây */}
                <SidebarTrigger />
                <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>
            </div>

            {/* Phần bên phải Header: User Info */}
            <div className="flex items-center gap-4">
                <Dropdown menu={{ items }} trigger={['click']}>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition">
                        <Avatar icon={<UserOutlined />} src={session?.user?.image} />
                        <span className="text-sm font-medium hidden sm:block">
                            {session?.user?.name}
                        </span>
                    </div>
                </Dropdown>
            </div>
        </header>
    );
}

export default AdminHeader;