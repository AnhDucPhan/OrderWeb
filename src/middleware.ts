import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Import hàm auth từ file cấu hình của bạn

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.role; // Lấy role từ session (đã config ở bước trước)
    const { nextUrl } = req;

    const isAdminRoute = nextUrl.pathname.startsWith('/admin');
    const isRootRoute = nextUrl.pathname === '/';
    const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

   
    if (isRootRoute && isLoggedIn && role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', nextUrl));
    }

    
    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/', nextUrl));
        }
        if (role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', nextUrl));
        }
    }

    // 3. (Tuỳ chọn) NẾU ĐÃ LOGIN MÀ CỐ VÀO TRANG LOGIN
    // -> Đá về trang tương ứng với role
    if (isAuthRoute && isLoggedIn) {
        if (role === 'ADMIN') {
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