'use client';

import Image from "next/image";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuCoffee } from "react-icons/lu";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, message } from "antd";
import { RootState } from "@/lib/store";
import { closeVerifyModal, openLoginModal } from "@/lib/features/ui/uiSlice";

const VerifyEmail = () => {
    const dispatch = useDispatch();
    
    // 👇 Lấy state từ Redux
    const { isVerifyModalOpen, emailToVerify } = useSelector((state: RootState) => state.ui);
    
    const [isLoading, setIsLoading] = useState(false);

    // Hàm gọi API khi gõ đủ 6 số
    const onFinishOTP = async (otpCode: string) => {
        if (!emailToVerify) {
            message.error('Không tìm thấy thông tin email!');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailToVerify, otpCode: otpCode })
            });
            
            const data = await res.json();

            if (res.ok) {
                message.success('Xác thực thành công! Vui lòng đăng nhập.');
                // Đóng form OTP, Mở form Login
                dispatch(closeVerifyModal());
                dispatch(openLoginModal());
            } else {
                message.error(data.message || 'Mã xác thực sai!');
            }
        } catch (error) {
            message.error('Lỗi máy chủ!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isVerifyModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => dispatch(closeVerifyModal())}
                ></div>
            )}

            <div
                className={`fixed top-0 right-0 h-full w-[90%] max-w-[500px] bg-white z-50 p-12 shadow-2xl
                transition-transform duration-300 ease-out overflow-y-auto custom-scrollbar
                ${isVerifyModalOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="flex flex-col min-h-full text-black">
                    <div className="flex items-center justify-between mb-8">
                        <div className="relative aspect-[487/120] w-[140px] sm:w-[170px]">
                            <Image src="/images/dark-logo.png" alt="logo" fill className="object-contain" />
                        </div>
                        <button
                            onClick={() => dispatch(closeVerifyModal())}
                            className="text-gray-700 hover:text-black transition"
                        >
                            <FaArrowLeftLong size={30} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-[#111] mx-auto mb-6 flex items-center justify-center">
                            <LuCoffee className="text-[#C19D56] text-3xl" />
                        </div>

                        <h2 className="text-3xl font-[Marcellus] font-bold text-[#111] mb-2">Nhập mã xác thực</h2>
                        <p className="text-gray-500 font-[DM_Sans] mb-8 text-sm">
                            Chúng tôi đã gửi mã 6 số đến email <br/>
                            <strong className="text-[#111]">{emailToVerify}</strong>
                        </p>

                        {/* COMPONENT NHẬP 6 SỐ CỦA ANTD */}
                        <div className="flex justify-center mb-8">
                           <Input.OTP 
                              length={6} 
                              onChange={onFinishOTP} 
                              disabled={isLoading}
                              size="large"
                           />
                        </div>

                        {isLoading && <p className="text-[#C19D56] animate-pulse mb-4">Đang kiểm tra mã...</p>}

                        <p className="text-sm text-gray-500 font-[DM_Sans]">
                            Chưa nhận được mã? <button className="text-[#C19D56] font-bold hover:underline">Gửi lại</button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VerifyEmail;