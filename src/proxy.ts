import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.role || '';
    const { nextUrl } = req;

    const isAdminRoute = nextUrl.pathname.startsWith('/admin');
    
    // Dùng mảng để so sánh chính xác tuyệt đối, tránh lỗi bắt nhầm route
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    const allowedAdminRoles = ['MANAGER', 'STAFF'];

    // 1. BẢO VỆ ROUTE /ADMIN
    if (isAdminRoute) {
        // Chưa đăng nhập -> Đá ra trang Login (kèm theo link để login xong quay lại đây)
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.pathname}`, nextUrl));
        }
        
        // Đã đăng nhập nhưng không đủ quyền -> Đá về trang chủ báo lỗi/hoặc trang 403
        if (!allowedAdminRoles.includes(role)) {
            return NextResponse.redirect(new URL('/', nextUrl));
        }
    }

    // 2. NẾU ĐÃ LOGIN MÀ CỐ VÀO TRANG LOGIN/REGISTER
    if (isAuthRoute && isLoggedIn) {
        // Nếu là Admin -> Cho vào Dashboard
        if (allowedAdminRoles.includes(role)) {
            return NextResponse.redirect(new URL('/admin', nextUrl));
        }
        // Nếu là Khách hàng -> Về trang chủ
        return NextResponse.redirect(new URL('/', nextUrl));
    }

    // Cho phép đi tiếp với mọi trường hợp hợp lệ
    return NextResponse.next();
});

// Config matcher giữ nguyên (rất chuẩn rồi)
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};