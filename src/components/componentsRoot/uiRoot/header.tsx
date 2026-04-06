'use client'

import Image from "next/image"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { BsArrowReturnRight } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
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

// 👇 IMPORT HOOK GỌI API
import { useGetProductsQuery } from "@/services/productApi";


const Header = () => {
    const path = usePathname();
    const isSignInPage = path === '/auth/signin';
    const text = isSignInPage ? 'Sign Up' : 'Sign In'
    const href = isSignInPage ? '/auth/signup' : '/auth/signin'
    const [openModalSearch, setOpenModalSearch] = useState(false)
    const [scrolled, setScrolled] = useState(false);

    const { isLoginModalOpen, isRegisterModalOpen } = useSelector((state: RootState) => state.ui);
    const isAnyFormOpen = isLoginModalOpen || isRegisterModalOpen;

    const { data: session, status } = useSession();
    const dispatch = useDispatch<AppDispatch>();

    const userEmail = session?.user?.email;

    // 👇 GỌI API LẤY DATA
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
        <header className={`fixed top-0 left-0 w-full h-[60px] sm:h-[80px] lg:h-[100px] flex items-center justify-between px-[30px] font-text-header font-dm z-50 transition-all duration-300
    ${scrolled
                ? "bg-white shadow-md"
                : "bg-black/20 "
            }`}>
            <Link href="/">
                <div className="relative aspect-[487/120] w-[40vw] max-w-[180px] sm:max-w-[220px] lg:max-w-[230px]">
                    <Image
                        src={scrolled ? "/images/dark-logo.png" : "/images/White-logo.png"}
                        alt="logo"
                        fill
                        className="object-contain"
                    />
                </div>
            </Link>
            <div>
                <nav className="flex justify-center">
                    <ul className={`grid grid-cols-5 gap-1 text-center transition-colors duration-300
      ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>
                        <li className="header-center relative group cursor-pointer">
                            <span className={`flex items-center gap-1 hover:text-[#C19D56] transition-colors
          ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>
                                News
                                <IoIosArrowDown className="transition-transform duration-300 group-hover:rotate-180" />
                            </span>

                            <div className="fixed top-[100px] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] bg-white shadow-lg p-6 rounded-lg
      opacity-0 translate-y-4 invisible
      group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible
      transition-all duration-500 ease-out z-50">

                                {/* 👇 MAP DỮ LIỆU API (Giữ nguyên 100% class UX của bạn) */}
                                <div className="grid grid-cols-6 text-center gap-2">
                                    {latestProducts.map((item, idx) => (
                                        <Link href={`/shop/${item.id}`} key={idx}>
                                            <div className="flex flex-col items-center cursor-pointer group transition-transform duration-300 hover:scale-105">
                                                <div className="w-full relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-md">
                                                    <Image
                                                        src={item.thumbnail && item.thumbnail.trim() !== "" ? item.thumbnail : "/images/placeholder.png"}
                                                        alt={item.name || "Product image"}
                                                        fill
                                                        sizes="(max-width: 1200px) 16vw"
                                                        className="object-cover transition-transform duration-500 ease-in-out group-hover/item:scale-110"
                                                    />
                                                </div>
                                                <span className="mt-2 text-black font-semibold transition-colors group-hover:text-[#C19D56]">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </li>
                        <li className="header-center relative group flex items-center gap-1 cursor-pointer">
                            <Link href='/shop'>
                                <span className={`hover:text-[#C19D56] transition-colors ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>
                                    Shop
                                </span>
                            </Link>
                            <IoIosArrowDown className={`${scrolled ? "text-[#0B0B24]" : "text-white"}`} />

                            <div className="absolute top-full left-1/2 -translate-x-1/4 mt-2 w-48 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <ul className="flex flex-col p-4 gap-3 text-left">
                                    <Link href='/shop/cart'>
                                        <li className="color-text-header hover:text-[#C19D56] transition-colors">Cart</li>
                                    </Link>

                                    <Link href='/shop/checkout'>
                                        <li className="color-text-header hover:text-[#C19D56] transition-colors">Check Out</li>
                                    </Link>

                                    <Link href='/shop/order'>
                                        <li className="color-text-header hover:text-[#C19D56] transition-colors">My Orders</li>
                                    </Link>
                                </ul>
                            </div>
                        </li>
                        <li className="header-center relative group">
                            <span className={`hover:text-[#C19D56] transition-colors
          ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>
                                Portfolio
                            </span>
                            <IoIosArrowDown />
                            <div className="absolute top-full left-1/2 -translate-x-1/4 mt-2 w-64 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <ul className=" flex flex-col p-4 gap-2 pl-6 text-left">
                                    <li className="color-text-header">Portfolio Default</li>
                                    <li className="color-text-header relative group/shop flex items-center justify-between cursor-pointer">
                                        <span>Portfolio Grid</span>
                                        <IoIosArrowForward className="arrow-icon" />
                                        <div className="absolute top-0 left-full ml-2 w-56 bg-white shadow-lg opacity-0 invisible group-hover/shop:opacity-100 group-hover/shop:visible transition-all duration-300">
                                            <ul className="flex flex-col p-4 gap-2 text-left">
                                                <li className="color-text-header">Cart</li>
                                                <li className="color-text-header">Check Out</li>
                                                <li className="color-text-header">My Account</li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="color-text-header">Portfolio Detail</li>
                                </ul>
                            </div>
                        </li>
                        <li className="header-center relative group">
                            <span className={`hover:text-[#C19D56] transition-colors
          ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>
                                Services
                            </span>
                            <IoIosArrowDown />
                            <div className="absolute top-full left-1/2 -translate-x-1/4 mt-2 w-64 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <ul className=" flex flex-col p-4 gap-2 pl-6 text-left">
                                    <li className="color-text-header">Espresso</li>
                                    <li className="color-text-header">Freshly Brewed Coffee</li>
                                    <li className="color-text-header">Artisan Pastries</li>
                                    <li className="color-text-header">Breakfast</li>
                                    <li className="color-text-header">Takeaway</li>
                                    <li className="color-text-header">Free Wi-fi</li>
                                </ul>
                            </div>
                        </li>
                        <li className="header-center relative group">
                            <span className={`hover:text-[#C19D56] transition-colors
          ${scrolled ? "text-[#0B0B24]" : "text-white"}`}>
                                Blog
                            </span>
                            <IoIosArrowDown />

                            <div className="absolute top-full left-1/2 -translate-x-1/4 mt-2 w-64 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <ul className=" flex flex-col p-4 gap-2 pl-6 text-left">
                                    <li className="color-text-header">Blog List</li>
                                    <li className="color-text-header">Blog Grid Overlay</li>
                                    <li className="color-text-header relative group/shop flex items-center justify-between cursor-pointer">
                                        <span>Blog Grid</span>
                                        <IoIosArrowForward className="arrow-icon" />
                                        <div className="absolute top-0 left-full ml-2 w-56 bg-white shadow-lg opacity-0 invisible group-hover/shop:opacity-100 group-hover/shop:visible transition-all duration-300">
                                            <ul className="flex flex-col p-4 gap-2 text-left">
                                                <li className="color-text-header">Cart</li>
                                                <li className="color-text-header">Check Out</li>
                                                <li className="color-text-header">My Account</li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="color-text-header">Blog Detail</li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="flex gap-6 items-center">
                <Link href={href} >
                    <button className="border border-transparent rounded-lg bg-[#C19D56] px-[25px] py-[10px] hover:bg-[#86624A] hover:border-[#C19D56] transition-colors duration-300">
                        <span className="flex items-center justify-center gap-4">
                            Book A Table
                        </span>
                    </button>
                </Link>

                <div>
                    <button
                        onClick={() => setOpenModalSearch(true)}
                        className={`text-lg sm:text-xl lg:text-2xl hover:text-[#C19D56] transition-colors
    ${scrolled ? "text-[#0B0B24]" : "text-white"}`}
                    >
                        <BsSearch />
                    </button>
                    {openModalSearch && (
                        <div className="fixed inset-0 z-50">
                            <div className="absolute inset-0 bg-black/40" onClick={() => setOpenModalSearch(false)} />

                            <div
                                className={`w-full h-[50vh] bg-[#86624A] absolute top-0 left-0 flex flex-col items-center justify-center relative animate-slide-down`}
                            >
                                <button
                                    onClick={() => setOpenModalSearch(false)}
                                    className="absolute top-4 right-4 text-white text-2xl hover:text-[#C19D56] transition-colors"
                                >
                                    ✕
                                </button>
                                <form className="w-3/4 max-w-xl">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full px-4 py-3 rounded-lg text-black focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="mt-4 w-full bg-[#C19D56] hover:bg-[#86624A] border border-transparent hover:border-[#C19D56] text-white py-3 rounded-lg transition-colors"
                                    >
                                        Search
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleIconClick}
                    className="rounded-full bg-[#C19D56] w-10 h-10 sm:w-14 sm:h-14
                flex items-center justify-center text-2xl sm:text-3xl text-white
                hover:bg-[#86624A] transition-colors duration-300"
                >
                    <i >
                        {session ? <RxAvatar size={30} /> : <BsArrowReturnRight size={20} />}
                    </i>
                </button>

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

            </div>
            <Profile />

        </header>
    )
}

export default Header