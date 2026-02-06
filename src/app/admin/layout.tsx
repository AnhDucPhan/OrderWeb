'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, theme, Spin, message } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UserOutlined,
    ShoppingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
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

    // Trong lúc đang check quyền hoặc chưa có session, hiện Loading để tránh lộ UI
    if (status === 'loading' || !session || session?.user?.role !== 'ADMIN') {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spin size="large" tip="Checking permission..." />
            </div>
        );
    }

    // --- MENU ITEMS ---
    const menuItems = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: <Link href="/admin">Dashboard</Link>,
        },
        {
            key: '/admin/products',
            icon: <ShoppingOutlined />,
            label: <Link href="/admin/products">Products</Link>,
        },
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: <Link href="/admin/users">Users</Link>,
        },
    ];

    return (
        <Layout className="min-h-screen">
            {/* Sidebar */}
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
                <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-100">
                    {collapsed ? 'AD' : 'MY ADMIN'}
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={[pathname]}
                    selectedKeys={[pathname]}
                    items={menuItems}
                />
            </Sider>

            <Layout>
                {/* Header */}
                <Header style={{ padding: 0, background: colorBgContainer }} className="flex justify-between items-center pr-6">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />

                    <div className="flex items-center gap-4">
                        <span className="font-semibold">Hi, {session.user.name}</span>
                        <Button
                            type="text"
                            danger
                            icon={<LogoutOutlined />}
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            Logout
                        </Button>
                    </div>
                </Header>

                {/* Nội dung trang con sẽ nằm ở đây */}
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}