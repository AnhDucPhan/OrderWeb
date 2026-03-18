import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Import hàm auth từ file cấu hình của bạn

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.role || ''; // Lấy role từ session
    const { nextUrl } = req;

    const isAdminRoute = nextUrl.pathname.startsWith('/admin');
    const isRootRoute = nextUrl.pathname === '/';
    const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

    const allowedAdminRoles = ['MANAGER', 'STAFF'];

    // 1. NẾU ĐANG Ở TRANG CHỦ MÀ ĐÃ LOGIN VÀ CÓ QUYỀN -> Đá vào /admin
    if (isRootRoute && isLoggedIn && allowedAdminRoles.includes(role)) {
        return NextResponse.redirect(new URL('/admin', nextUrl));
    }

    // 2. BẢO VỆ ROUTE /ADMIN
    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/', nextUrl));
        }
        // 👇 Nếu role KHÔNG nằm trong danh sách cho phép -> Đá về trang chủ
        if (!allowedAdminRoles.includes(role)) {
            return NextResponse.redirect(new URL('/', nextUrl));
        }
    }

    // 3. (Tuỳ chọn) NẾU ĐÃ LOGIN MÀ CỐ VÀO TRANG LOGIN
    // -> Đá về trang tương ứng với role
    if (isAuthRoute && isLoggedIn) {
        if (allowedAdminRoles.includes(role)) {
            return NextResponse.redirect(new URL('/admin', nextUrl));
        }
        return NextResponse.redirect(new URL('/', nextUrl));
    }

    return NextResponse.next();
});

// Config matcher để middleware chạy trên các route cần thiết
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};