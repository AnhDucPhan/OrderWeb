'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, theme, Spin, message } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { AppSidebar } from '@/components/componentsAdmin/uiAdmin/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminHeader from '@/components/componentsAdmin/uiAdmin/header';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();

    // --- LOGIC BẢO VỆ ROUTE ---
    useEffect(() => {
        if (status === 'loading') return; // Đang check session thì chưa làm gì
        console.log("AdminLayout Session Check:", session?.user);
        // 1. Chưa đăng nhập -> Đá về login
        if (!session) {
            router.push('/');
            return;
        }

        // 2. Đăng nhập rồi nhưng không phải admin -> Đá về trang chủ
        // Lưu ý: Bạn cần config NextAuth trả về role trong session
        if (session?.user?.role !== 'ADMIN') {
            message.error('Bạn không có quyền truy cập trang này!');
            router.push('/');
        }
    }, [session, status, router]);

    if (status === 'loading' || !session || session?.user?.role !== 'ADMIN') {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spin size="large" >
                    <div>
                    </div>
                </Spin>
            </div>
        );
    }

    return (
        <SidebarProvider>
            {/* XÓA class p-6 ở đây để khung bao phủ toàn màn hình */}
            <div className="flex min-h-screen w-full">

                {/* Sidebar sẽ dính sát lề trái */}
                <AppSidebar />

                <main className="flex flex-1 flex-col w-full transition-all duration-300 ease-in-out">

                    <AdminHeader />

                    {/* Chỉ thêm padding ở khu vực nội dung này thôi */}
                    {/* Bạn có thể tăng p-4 lên p-6 ở đây nếu muốn nội dung thoáng hơn */}
                    <div className="flex-1 p-6 bg-gray-50/50">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}