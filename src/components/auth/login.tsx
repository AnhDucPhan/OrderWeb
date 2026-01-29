'use client';

import Image from "next/image";
import { FaRegEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useState, Dispatch, SetStateAction } from "react"; // Import thêm Dispatch, SetStateAction
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// 1. Định nghĩa kiểu dữ liệu cho Props nhận vào
interface LoginProps {
    openFormLogin: boolean;
    setOpenFormLogin: Dispatch<SetStateAction<boolean>>; 
    // Hoặc viết đơn giản: (value: boolean) => void;
}

// 2. Nhận props vào hàm
const Login = ({ openFormLogin, setOpenFormLogin }: LoginProps) => {
    
    // State nội bộ để xử lý form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // State xử lý loading và lỗi
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Chặn reload trang
        setIsLoading(true);
        setErrorMsg('');

        try {
            // Gọi NextAuth
            const res = await signIn('credentials', {
                email: email,
                password: password,
                redirect: false,
            });

            if (res?.error) {
                setErrorMsg("Email hoặc mật khẩu không chính xác!");
            } else {
                // Thành công:
                setOpenFormLogin(false); // Đóng form bằng hàm từ Cha gửi xuống
                router.refresh(); 
            }
        } catch (error) {
            setErrorMsg("Lỗi kết nối, vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {/* Lớp phủ mờ (Overlay) - Bấm ra ngoài thì đóng */}
            {openFormLogin && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setOpenFormLogin(false)}
                ></div>
            )}

            <div
                className={`fixed top-0 right-0 h-full w-[90%] max-w-[500px] bg-white z-50 p-12 shadow-2xl
                transition-transform duration-300 ease-out
                ${openFormLogin ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="flex flex-col h-full text-black">
                    {/* Header: Nút đóng */}
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
                            onClick={() => setOpenFormLogin(false)}
                            className="text-gray-700 hover:text-black transition"
                        >
                            <FaArrowLeftLong size={30} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 flex flex-col justify-center">
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-1">
                                <h2 className="flex justify-center text-4xl font-semibold">Welcome Back</h2>
                                {errorMsg && <p className="text-red-500 text-center text-sm">{errorMsg}</p>}
                            </div>

                            {/* Email Input */}
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

                            {/* Password Input */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full rounded-lg py-3 text-white font-semibold transition-colors
                                    ${isLoading ? 'bg-gray-400' : 'bg-[#C19D56] hover:bg-[#86624A]'}
                                `}
                            >
                                {isLoading ? "Processing..." : "Sign In"}
                            </button>
                            
                            {/* Footer Link */}
                            <p className="text-center text-sm text-gray-600">
                                Don’t have an account? <span className="text-[#C19D56] cursor-pointer hover:underline">Sign Up</span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;