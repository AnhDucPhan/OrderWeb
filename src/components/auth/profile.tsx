'use client';

import Image from "next/image";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { closeProfile } from "@/lib/features/ui/uiSlice";
import { useSession, signOut } from "next-auth/react";
import { RxAvatar } from "react-icons/rx";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";

const Profile = () => {
    // 1. Lấy trạng thái từ Redux
    const isProfileOpen = useSelector((state: RootState) => state.ui.isProfileOpen);
    const dispatch = useDispatch();

    // 2. Lấy thông tin user từ session
    const { data: session } = useSession();
    const user = session?.user as any; 

    console.log("Thông tin user từ session:", user);
    // Hàm format ngày tháng (VD: Tháng 11, 2025)
    const formatDate = (dateString: string) => {
        if (!dateString) return "Đang cập nhật...";
        const date = new Date(dateString);
        return `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
    };

    return (
        <>
            {/* Overlay nền đen có hiệu ứng mờ dần (Fade) */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ease-in-out ${
                    isProfileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => dispatch(closeProfile())}
            ></div>

            {/* Modal Profile (Hiệu ứng trượt từ phải sang) */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto ${
                    isProfileOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full relative">
                    
                    {/* --- HEADER --- */}
                    <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-8 py-6 flex items-center justify-between border-b border-gray-100">
                        <button
                            onClick={() => dispatch(closeProfile())}
                            className="p-2 -ml-2 text-gray-400 hover:text-[#C19D56] hover:bg-gray-50 rounded-full transition-all duration-300"
                            aria-label="Đóng bảng tài khoản"
                        >
                            <FaArrowLeftLong size={20} />
                        </button>
                        <h2 className="text-xl font-[Marcellus] font-bold text-[#111111] tracking-wide">
                            Tài Khoản
                        </h2>
                        <div className="w-8"></div> {/* Spacer để cân bằng title */}
                    </div>

                    {/* --- CONTENT --- */}
                    <div className="flex-1 px-8 py-10 flex flex-col font-[DM_Sans]">
                        
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-12">
                            <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#C19D56] to-[#e6cc98] shadow-lg mb-5">
                                <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-gray-50 relative">
                                    {user?.image ? (
                                        <Image
                                            src={user.image}
                                            alt="Ảnh đại diện"
                                            fill
                                            className="object-cover"
                                            sizes="112px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <RxAvatar size={60} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-[#111111] mb-1">
                                {user?.name || "Khách hàng"}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Thành viên Cofybrew
                            </p>
                        </div>

                        {/* Info Fields */}
                        <div className="flex flex-col gap-6">
                            
                            {/* Họ Tên */}
                            <div className="group">
                                <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 mb-2 block">
                                    Họ và tên
                                </label>
                                <div className="flex items-center gap-4 bg-gray-50/50 border border-gray-200 rounded-xl px-5 py-4 transition-colors duration-300 group-hover:border-[#C19D56]/50">
                                    <FiUser className="text-xl text-gray-400 flex-shrink-0" />
                                    <input
                                        type="text"
                                        value={user?.name || ''}
                                        readOnly
                                        className="w-full bg-transparent text-[#111111] font-medium text-[15px] outline-none"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 mb-2 block">
                                    Địa chỉ Email
                                </label>
                                <div className="flex items-center gap-4 bg-gray-50/50 border border-gray-200 rounded-xl px-5 py-4 transition-colors duration-300 group-hover:border-[#C19D56]/50">
                                    <HiOutlineMail className="text-xl text-gray-400 flex-shrink-0" />
                                    <input
                                        type="text"
                                        value={user?.email || ''}
                                        readOnly
                                        className="w-full bg-transparent text-gray-600 text-[15px] outline-none"
                                    />
                                </div>
                            </div>

                            {/* Ngày tham gia */}
                            <div className="group">
                                <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 mb-2 block">
                                    Ngày tham gia
                                </label>
                                <div className="flex items-center gap-4 bg-[#C19D56]/5 border border-[#C19D56]/20 rounded-xl px-5 py-4">
                                    <HiOutlineCalendarDays className="text-xl text-[#C19D56] flex-shrink-0" />
                                    <input
                                        type="text"
                                        value={formatDate(user?.createdAt)}
                                        readOnly
                                        className="w-full bg-transparent text-[#86624A] font-semibold text-[15px] outline-none"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* --- FOOTER --- */}
                    <div className="p-8 mt-auto border-t border-gray-100 bg-gray-50/30">
                        <button
                            onClick={() => {
                                dispatch(closeProfile());
                                setTimeout(() => signOut(), 300); // Đợi modal đóng xong mới load lại trang
                            }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-gray-200 py-4 text-gray-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 shadow-sm"
                        >
                            <span>Đăng xuất tài khoản</span>
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Profile;