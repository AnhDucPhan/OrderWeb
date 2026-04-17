'use client';

import Image from "next/image";
import { FaRegEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from 'next/navigation'; // 👇 Thêm useRouter để chuyển trang
import { message } from "antd"; // 👇 Dùng antd message cho đẹp thay vì alert
import { openVerifyModal } from "@/lib/features/ui/uiSlice";
import { useDispatch } from "react-redux";

interface RegisterProps {
    openFormRegister: boolean;
    setOpenFormRegister: Dispatch<SetStateAction<boolean>>;
    onSwitchToLogin: () => void; 
}

const Register = ({ openFormRegister, setOpenFormRegister, onSwitchToLogin }: RegisterProps) => {
    const dispatch = useDispatch();
    // State form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false); // 👇 Quản lý loading thủ công
    
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setErrorMsg('');
        setIsLoading(true);

        try {
            // 👇 GỌI TRỰC TIẾP VÀO CỬA DÀNH CHO KHÁCH HÀNG (auth/register)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Thành công
                message.success("Đăng ký thành công! Vui lòng kiểm tra email.");
                // Xóa trắng form
                setName('');
                setEmail('');
                setPassword('');
                
                // Đóng popup đăng ký
                setOpenFormRegister(false);

                // Chuyển sang màn hình xác thực 6 số
                dispatch(openVerifyModal(email));

            } else {
                // Bắt lỗi từ Backend (Ví dụ: "Email đã tồn tại")
                setErrorMsg(data.message || "Đăng ký thất bại, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            setErrorMsg("Lỗi kết nối đến máy chủ!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div
                className={`fixed top-0 right-0 h-full w-[90%] max-w-[500px] bg-white z-50 p-12 shadow-2xl
                transition-transform duration-300 ease-out overflow-y-auto custom-scrollbar
                ${openFormRegister ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="flex flex-col min-h-full text-black">
                    <div className="flex items-center justify-between mb-8">
                        <div className="relative aspect-[487/120] w-[140px] sm:w-[170px]">
                            <Image
                                src="/images/dark-logo.png"
                                alt="logo"
                                fill
                                className="object-contain"
                            />
                        </div>

                        <button
                            onClick={() => setOpenFormRegister(false)}
                            className="text-gray-700 hover:text-black transition"
                        >
                            <FaArrowLeftLong size={30} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <form className="space-y-5" onSubmit={handleRegister}>
                            <div className="space-y-1 mb-2">
                                <h2 className="flex justify-center text-4xl font-semibold">Create Account</h2>
                                {errorMsg && <p className="text-red-500 text-center text-sm mt-2 font-medium bg-red-50 py-2 rounded-lg border border-red-100">{errorMsg}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#C19D56]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#C19D56]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-[#C19D56]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <FaRegEye /> : <IoIosEyeOff />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full rounded-lg py-3 text-white font-semibold transition-colors mt-2
                                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C19D56] hover:bg-[#86624A]'}
                                `}
                            >
                                {isLoading ? "Creating Account..." : "Sign Up"}
                            </button>
                            
                            <p className="text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <span 
                                    className="text-[#C19D56] cursor-pointer hover:underline font-medium"
                                    onClick={onSwitchToLogin}
                                >
                                    Sign In
                                </span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;