import NextAuth from 'next-auth';
import { authConfig } from './auth.config'; // 👈 Import config mới
import { NextResponse } from 'next/server';

// Khởi tạo auth riêng cho Middleware từ config nhẹ
const { auth } = NextAuth(authConfig); 

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.role || '';
    const { nextUrl } = req;

    const isAdminRoute = nextUrl.pathname.startsWith('/admin');
    
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // 👇 ĐÃ THÊM 'ADMIN' ĐỂ ĐỒNG BỘ VỚI FRONTEND
    const allowedAdminRoles = ['MANAGER', 'STAFF', 'ADMIN'];

    // 1. BẢO VỆ ROUTE /ADMIN
    if (isAdminRoute) {
        if (!isLoggedIn) {
            // Đổi về trang chủ mở popup nếu không có trang /login
            return NextResponse.redirect(new URL(`/?showLogin=true&callbackUrl=${nextUrl.pathname}`, nextUrl));
        }
        
        if (!allowedAdminRoles.includes(role)) {
            return NextResponse.redirect(new URL('/', nextUrl));
        }
    }

    // 2. CHẶN VÀO LẠI LOGIN/REGISTER KHI ĐÃ LOGIN
    if (isAuthRoute && isLoggedIn) {
        if (allowedAdminRoles.includes(role)) {
            return NextResponse.redirect(new URL('/admin', nextUrl));
        }
        return NextResponse.redirect(new URL('/', nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};