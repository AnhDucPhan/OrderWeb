'use client';

import React, { useEffect } from 'react';
import { theme, Spin, message } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { AppSidebar } from '@/components/componentsAdmin/uiAdmin/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminHeader from '@/components/componentsAdmin/uiAdmin/header';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/hook';
import { notificationApi } from '@/services/notificationApi';

const allowedRoles = ['MANAGER', 'STAFF'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Kết nối Socket (nhớ đổi port cho khớp backend của bạn)
        const socket = io('http://localhost:8386');

        socket.on('NEW_NOTIFICATION', (data) => {
            // Hiện thông báo xịn xò
            toast.info("🔔 Bạn có thông báo mới!");

            // 💥 CHIÊU CUỐI: Bắn tín hiệu để RTK Query gọi lại API lấy hòm thư mới nhất
            dispatch(notificationApi.util.invalidateTags(['Notification']));
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch]);

    // --- LOGIC BẢO VỆ ROUTE ---
    useEffect(() => {
        if (status === 'loading') return; // Đang check session thì chưa làm gì

        // 1. Chưa đăng nhập -> Đá về login
        if (!session) {
            router.push('/');
            return;
        }

        const userRole = session?.user?.role || "";

        // 2. Đăng nhập rồi nhưng không thuộc các role cho phép -> Đá về trang chủ
        if (!allowedRoles.includes(userRole)) {
            message.error('Bạn không có quyền truy cập trang này!');
            router.push('/');
        }
    }, [session, status, router]);

    const userRole = session?.user?.role || "";

    // 👇 Cập nhật lại điều kiện hiển thị loading/chặn render nội dung
    if (status === 'loading' || !session || !allowedRoles.includes(userRole)) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">

                {/* Sidebar sẽ dính sát lề trái */}
                <AppSidebar />

                {/* 1. THÊM `min-w-0` VÀO ĐÂY: Ép thẻ main không được phình to quá màn hình */}
                <main className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out w-full">

                    {/* Header sẽ đứng im, không bị kéo ngang nữa */}
                    <AdminHeader />

                    {/* 2. THÊM `overflow-x-auto` VÀO ĐÂY: Cho phép nội dung con tự cuộn ngang nếu quá rộng */}
                    <div className="flex-1 p-6 bg-gray-50/50 overflow-x-auto">
                        {children}
                    </div>

                </main>
            </div>
        </SidebarProvider>
    );
}