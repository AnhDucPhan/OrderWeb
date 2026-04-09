'use client'

import Image from "next/image"
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsSearch, BsArrowReturnRight } from "react-icons/bs";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { useSession } from "next-auth/react";

import Login from "../../auth/login";
import Profile from "../../auth/profile";
import Register from "../../auth/register";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
    openProfile,
    openLoginModal,
    closeLoginModal,
    openRegisterModal,
    closeRegisterModal,
    closeAllAuthModals
} from "@/lib/features/ui/uiSlice";
import { getCartAPI } from "@/lib/features/cartSlice";
import { usePathname, useRouter } from "next/navigation";
// IMPORT HOOK GỌI API
import { useGetProductsQuery } from "@/services/productApi";

const Header = () => {
    const path = usePathname();
    const isSignInPage = path === '/auth/signin';
    const text = isSignInPage ? 'Đăng Ký' : 'Đăng Nhập';
    const href = isSignInPage ? '/auth/signup' : '/auth/signin';
    const [openModalSearch, setOpenModalSearch] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const router = useRouter();

    // State cho Mobile Menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { isLoginModalOpen, isRegisterModalOpen } = useSelector((state: RootState) => state.ui);
    const isAnyFormOpen = isLoginModalOpen || isRegisterModalOpen;

    const { data: session, status } = useSession();
    const dispatch = useDispatch<AppDispatch>();

    const userEmail = session?.user?.email;

    // 👇 1. LẤY ROLE TỪ SESSION ĐỂ KIỂM TRA QUYỀN ADMIN
    // (Dùng 'any' ép kiểu để tránh lỗi TS nếu next-auth.d.ts chưa khai báo role)
    const userRole = (session?.user as any)?.role;
    const isAdmin = userRole === 'MANAGER' || userRole === 'STAFF' || userRole === 'ADMIN';

    // GỌI API LẤY DATA CHO MEGA MENU
    const { data: latestProductsResponse } = useGetProductsQuery({
        page: 1,
        items_per_page: 6,
        orderBy: 'createdAt',
        sort: 'desc'
    });

    const latestProducts = latestProductsResponse?.data || [];

    useEffect(() => {
        if (status === 'authenticated' && userEmail) {
            dispatch(getCartAPI());
        }
    }, [status, userEmail, dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleIconClick = () => {
        if (session) {
            dispatch(openProfile());
        } else {
            dispatch(openLoginModal());
        }
    };

    return (
        <header className={`fixed top-0 left-0 w-full h-[60px] sm:h-[80px] lg:h-[100px] flex items-center justify-between px-4 lg:px-[30px] font-text-header font-dm-sans z-50 transition-all duration-300
    ${scrolled ? "bg-white shadow-md" : "bg-black/20"}`}>

            {/* ================= 1. LOGO ================= */}
            <Link href="/" aria-label="Trang chủ Cofybrew">
                <div className="relative aspect-[487/120] w-[40vw] max-w-[150px] sm:max-w-[220px] lg:max-w-[230px]">
                    <Image
                        src={scrolled ? "/images/dark-logo.png" : "/images/White-logo.png"}
                        alt="Logo Cofybrew"
                        fill
                        className="object-contain"
                    />
                </div>
            </Link>

            {/* ================= 2. DESKTOP NAVIGATION ================= */}
            <div className="hidden lg:block flex-1">
                <nav aria-label="Điều hướng chính" className="flex justify-center">
                    <ul className={`grid grid-cols-5 gap-1 text-center transition-colors duration-300 ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>

                        {/* ITEM: TIN TỨC (MEGA MENU) */}
                        <li className="header-center relative group cursor-pointer">
                            <span className={`flex items-center gap-1 hover:text-[#C19D56] transition-colors ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>
                                New
                                <IoIosArrowDown className="transition-transform duration-300 group-hover:rotate-180" />
                            </span>

                            <div className="fixed top-[100px] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] bg-white shadow-lg p-6 rounded-lg opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-500 ease-out z-50">
                                <div className="grid grid-cols-6 text-center gap-2">
                                    {latestProducts.map((item, idx) => (
                                        <Link href={`/shop/${item.id}`} key={idx}>
                                            <div className="flex flex-col items-center cursor-pointer group transition-transform duration-300 hover:scale-105">
                                                <div className="w-full relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-md">
                                                    <Image
                                                        src={item.thumbnail && item.thumbnail.trim() !== "" ? item.thumbnail : "/images/placeholder.png"}
                                                        alt={item.name || "Hình ảnh sản phẩm"}
                                                        fill
                                                        sizes="(max-width: 1200px) 16vw"
                                                        className="object-cover transition-transform duration-500 ease-in-out group-hover/item:scale-110"
                                                    />
                                                </div>
                                                <span className="mt-2 text-black font-semibold transition-colors group-hover:text-[#C19D56] line-clamp-1">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </li>

                        {/* ITEM: CỬA HÀNG */}
                        <li className="header-center relative group flex items-center gap-1 cursor-pointer">
                            <Link href='/shop'>
                                <span className={`hover:text-[#C19D56] transition-colors ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>
                                    Cửa Hàng
                                </span>
                            </Link>
                            <IoIosArrowDown className={`${scrolled ? "text-[#0B0B24]" : "text-white"}`} />

                            <div className="absolute top-full left-1/2 -translate-x-1/4 mt-2 w-56 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <ul className="flex flex-col p-4 gap-3 text-left">
                                    <Link href='/shop/cart'><li className="color-text-header hover:text-[#C19D56] transition-colors">Giỏ Hàng</li></Link>
                                    <Link href='/shop/checkout'><li className="color-text-header hover:text-[#C19D56] transition-colors">Thanh Toán</li></Link>
                                    <Link href='/shop/order'><li className="color-text-header hover:text-[#C19D56] transition-colors">Đơn Hàng Của Tôi</li></Link>
                                </ul>
                            </div>
                        </li>

                        {/* ITEM: BỘ SƯU TẬP (Portfolio) */}
                        <li className="header-center relative group">
                            <span className={`flex items-center gap-1 hover:text-[#C19D56] transition-colors ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>
                                Bộ Sưu Tập <IoIosArrowDown />
                            </span>
                            <div className="absolute top-full left-1/2 -translate-x-1/4 mt-2 w-64 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <ul className="flex flex-col p-4 gap-2 pl-6 text-left">
                                    <li className="color-text-header">Bảng Đánh Giá</li>
                                    <li className="color-text-header relative group/shop flex items-center justify-between cursor-pointer">
                                        <span>Theo Mùa</span>
                                        <IoIosArrowForward className="arrow-icon" />
                                        <div className="absolute top-0 left-full ml-2 w-56 bg-white shadow-lg opacity-0 invisible group-hover/shop:opacity-100 group-hover/shop:visible transition-all duration-300">
                                            <ul className="flex flex-col p-4 gap-2 text-left">
                                                <li className="color-text-header">Mùa Xuân</li>
                                                <li className="color-text-header">Mùa Hè</li>
                                                <li className="color-text-header">Mùa Thu</li>
                                                <li className="color-text-header">Mùa Đông</li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="color-text-header">Chi Tiết</li>
                                </ul>
                            </div>
                        </li>

                        {/* ITEM: DỊCH VỤ */}
                        <li className="header-center relative group">
                            <span className={`flex items-center gap-1 hover:text-[#C19D56] transition-colors ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>
                                Dịch Vụ <IoIosArrowDown />
                            </span>
                            <div className="absolute top-full left-1/2 -translate-x-1/4 mt-2 w-64 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <ul className="flex flex-col p-4 gap-2 pl-6 text-left">
                                    <li className="color-text-header">Cà Phê Espresso</li>
                                    <li className="color-text-header">Cà Phê Pha Máy Tươi</li>
                                    <li className="color-text-header">Bánh Ngọt Thủ Công</li>
                                    <li className="color-text-header">Điểm Tâm Sáng</li>
                                    <li className="color-text-header">Dịch Vụ Mang Về</li>
                                    <li className="color-text-header">Wi-fi Miễn Phí</li>
                                </ul>
                            </div>
                        </li>

                        {/* ITEM: BÀI VIẾT */}
                        <li className="header-center relative group">
                            <span className={`flex items-center gap-1 hover:text-[#C19D56] transition-colors ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>
                                Bài Viết
                            </span>

                        </li>
                    </ul>
                </nav>
            </div>

            {/* ================= 3. RIGHT ACTIONS ================= */}
            <div className="flex gap-4 sm:gap-6 items-center">

                {isAdmin && (
                    <button
                        onClick={() => router.push('/admin')} // 👈 Đẩy trang bằng code
                        className="hidden lg:block border border-transparent rounded-lg bg-[#111111] text-white px-[15px] lg:px-[20px] py-[6px] lg:py-[8px] hover:bg-[#C19D56] transition-colors duration-300 font-semibold text-sm shadow-md"
                    >
                        <span className="flex items-center gap-2 whitespace-nowrap">
                            Quản Trị
                        </span>
                    </button>
                )}

                {/* Nút Tìm kiếm */}
                <div>
                    <button
                        aria-label="Mở tìm kiếm"
                        onClick={() => setOpenModalSearch(true)}
                        className={`text-xl lg:text-2xl hover:text-[#C19D56] transition-colors ${scrolled ? "text-[#0B0B24]" : "text-white"}`}
                    >
                        <BsSearch />
                    </button>
                    {openModalSearch && (
                        <div className="fixed inset-0 z-[100]">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpenModalSearch(false)} />
                            <div className="w-full h-[50vh] bg-[#86624A] absolute top-0 left-0 flex flex-col items-center justify-center relative animate-slide-down shadow-xl">
                                <button
                                    onClick={() => setOpenModalSearch(false)}
                                    className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white text-3xl hover:text-[#C19D56] transition-colors"
                                >
                                    ✕
                                </button>
                                <form className="w-[90%] sm:w-3/4 max-w-xl" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        placeholder="Nhập từ khóa tìm kiếm..."
                                        className="w-full px-4 py-4 rounded-lg text-black focus:outline-none font-dm-sans"
                                    />
                                    <button
                                        type="submit"
                                        className="mt-4 w-full bg-[#C19D56] hover:bg-[#6c4e3a] border border-transparent text-white py-3 rounded-lg transition-colors font-bold tracking-wide font-dm-sans"
                                    >
                                        TÌM KIẾM
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Nút Tài khoản */}
                <button
                    aria-label="Mở Menu Tài Khoản"
                    onClick={handleIconClick}
                    className="rounded-full bg-[#C19D56] w-9 h-9 sm:w-10 sm:h-10 lg:w-14 lg:h-14 flex items-center justify-center text-xl sm:text-2xl lg:text-3xl text-white hover:bg-[#86624A] transition-colors duration-300"
                >
                    <i>{session ? <RxAvatar size={26} className="lg:w-[30px] lg:h-[30px]" /> : <BsArrowReturnRight size={18} className="lg:w-[20px] lg:h-[20px]" />}</i>
                </button>

                {/* Nút Hamburger cho Menu Mobile */}
                <button
                    aria-label="Mở Menu Điều Hướng"
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={`lg:hidden text-2xl sm:text-3xl hover:text-[#C19D56] transition-colors ${scrolled ? "text-[#0B0B24]" : "text-white"}`}
                >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" strokeWidth="2" d="M2,19 L22,19 M2,5 L22,5 M2,12 L22,12"></path></svg>
                </button>
            </div>

            {/* ============================================================== */}
            {/* MOBILE MENU OVERLAY */}
            {/* ============================================================== */}
            <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className={`absolute top-0 right-0 w-[80vw] max-w-[320px] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="p-5 flex justify-between items-center border-b border-gray-100">
                        <span className="font-marcellus text-xl text-[#111111] font-bold">MENU TRANG</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-3xl text-gray-500 hover:text-[#C19D56]">✕</button>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-5">
                        <ul className="flex flex-col gap-6 text-lg font-dm-sans text-[#111111] font-medium">
                            <li><Link href="/news" onClick={() => setIsMobileMenuOpen(false)}>Tin Tức</Link></li>
                            <li><Link href="/shop" prefetch={false} onClick={() => setIsMobileMenuOpen(false)}>Cửa Hàng</Link></li>
                            <li><Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>Dịch Vụ</Link></li>
                            <li><Link href="/portfolio" onClick={() => setIsMobileMenuOpen(false)}>Bộ Sưu Tập</Link></li>
                            <li><Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>Bài Viết</Link></li>

                            {/* Nút Đặt Bàn (Đang comment bên ngoài nhưng bạn có thể để đây) */}
                            <li className="pt-4 border-t border-gray-100">
                                <Link href="/book-table" onClick={() => setIsMobileMenuOpen(false)} className="text-[#C19D56] font-bold">
                                    ĐẶT BÀN NGAY
                                </Link>
                            </li>

                            {/* 👇 3. NÚT VÀO TRANG QUẢN TRỊ TRÊN MOBILE (CHỈ HIỆN VỚI ADMIN) */}
                            {isAdmin && (
                                <li className="pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            router.push('/admin'); // 👈 Đẩy trang bằng code
                                        }}
                                        className="text-[#111] font-bold flex items-center gap-2 hover:text-[#C19D56] transition-colors w-full text-left"
                                    >
                                        VÀO BẢNG ĐIỀU KHIỂN <IoIosArrowForward />
                                    </button>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* ============================================================== */}
            {/* AUTH MODALS */}
            {/* ============================================================== */}
            <div
                className={`fixed inset-0 z-50 ${isAnyFormOpen ? "pointer-events-auto" : "pointer-events-none"}`}
            >
                <div
                    onClick={() => dispatch(closeAllAuthModals())}
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-300
                            ${isAnyFormOpen ? "opacity-100" : "opacity-0"}
                        `}
                />

                <Login
                    openFormLogin={isLoginModalOpen}
                    setOpenFormLogin={(isOpen) => isOpen ? dispatch(openLoginModal()) : dispatch(closeLoginModal())}
                    onSwitchToRegister={() => dispatch(openRegisterModal())}
                />

                <Register
                    openFormRegister={isRegisterModalOpen}
                    setOpenFormRegister={(isOpen) => isOpen ? dispatch(openRegisterModal()) : dispatch(closeRegisterModal())}
                    onSwitchToLogin={() => dispatch(openLoginModal())}
                />
            </div>

            {/* ============================================================== */}
            {/* PROFILE DRAWER */}
            {/* ============================================================== */}
            <Profile />

        </header>
    )
}

export default Header