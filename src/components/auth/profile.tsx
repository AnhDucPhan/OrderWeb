

'use client';

import Image from "next/image";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { closeProfile } from "@/lib/features/ui/uiSlice";
import { useSession, signOut } from "next-auth/react";
import { RxAvatar } from "react-icons/rx";


const Profile = () => {
    // 1. Lấy trạng thái từ Redux
    const isProfileOpen = useSelector((state: RootState) => state.ui.isProfileOpen);
    const dispatch = useDispatch();
    
    // 2. Lấy thông tin user từ session
    const { data: session } = useSession();
    const user = session?.user as any; // Ép kiểu any để lấy các trường custom như role, createdAt

    // Hàm format ngày tháng (VD: 02/11/2025)
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <>
            {/* Overlay nền đen */}
            {isProfileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => dispatch(closeProfile())}
                ></div>
            )}

            {/* Modal Profile */}
            <div
                className={`fixed top-0 right-0 h-full w-[90%] max-w-[500px] bg-white z-50 p-12 shadow-2xl
                transition-transform duration-300 ease-out
                ${isProfileOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="flex flex-col h-full text-black">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-[#C19D56]">My Profile</h2>
                        <button
                            onClick={() => dispatch(closeProfile())}
                            className="text-gray-700 hover:text-black transition"
                        >
                            <FaArrowLeftLong size={30} />
                        </button>
                    </div>

                    {/* Content Form */}
                    <div className="flex-1 flex flex-col gap-6">
                        
                        {/* Avatar to */}
                        <div className="flex justify-center mb-4">
                            <div className="relative w-24 h-24 rounded-full border-4 border-[#C19D56] overflow-hidden">
                                {user?.image ? (
                                    <Image 
                                        src={user.image}
                                        alt="User Avatar"
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <RxAvatar size={40} className="text-gray-500" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                type="text" 
                                value={user?.name || ''} 
                                readOnly 
                                className="w-full bg-gray-100 rounded-lg px-4 py-3 text-black font-medium border-none outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                type="text" 
                                value={user?.email || ''} 
                                readOnly 
                                className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-600 border-none outline-none"
                            />
                        </div>

                        {/* Role & Created At (Chung 1 hàng) */}
                        <div className="flex gap-4">
                            <div className="flex-1 flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Role</label>
                                <input 
                                    type="text" 
                                    value={user?.role || 'USER'} 
                                    readOnly 
                                    className="w-full bg-[#C19D56]/10 text-[#C19D56] rounded-lg px-4 py-3 font-bold border-none outline-none"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Joined Date</label>
                                <input 
                                    type="text" 
                                    value={formatDate(user?.createdAt)} 
                                    readOnly 
                                    className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-600 border-none outline-none"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Footer: Logout Button */}
                    <div className="mt-auto">
                        <button
                            onClick={() => {
                                dispatch(closeProfile()); // Đóng modal trước
                                signOut(); // Đăng xuất
                            }}
                            className="w-full rounded-lg bg-red-500 py-3 text-white font-semibold hover:bg-red-600 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;