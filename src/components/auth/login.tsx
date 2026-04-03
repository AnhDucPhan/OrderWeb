'use client';

import Image from "next/image";
import { FaRegEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
// 👇 1. Import thêm icon Google
import { FcGoogle } from "react-icons/fc"; 
import { useState, Dispatch, SetStateAction } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginProps {
    openFormLogin: boolean;
    setOpenFormLogin: Dispatch<SetStateAction<boolean>>;
    onSwitchToRegister: () => void;
}

const Login = ({ openFormLogin, setOpenFormLogin, onSwitchToRegister }: LoginProps) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const res = await signIn('credentials', {
                email: email,
                password: password,
                redirect: false,
            });
            console.log("Cục data Login Backend trả về:", res);

            if (res?.error) {
                setErrorMsg("Email hoặc mật khẩu không chính xác!");
            } else {
                setOpenFormLogin(false);
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
            {/* Lớp phủ mờ (Overlay) */}
            {openFormLogin && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setOpenFormLogin(false)}
                ></div>
            )}

            <div
                className={`fixed top-0 right-0 h-full w-[90%] max-w-[500px] bg-white z-50 p-12 shadow-2xl
                transition-transform duration-300 ease-out overflow-y-auto
                ${openFormLogin ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="flex flex-col min-h-full text-black">
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
                        </form>

                        {/* 👇 2. KHU VỰC THÊM MỚI: Dòng kẻ chữ OR và Nút Google */}
                        <div className="my-6 flex items-center justify-between">
                            <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
                            <span className="text-xs text-center text-gray-500 uppercase font-medium">
                                Or login with
                            </span>
                            <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
                        </div>

                        <button
                            type="button" // Bắt buộc là type="button" để không submit form
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                            className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm mb-6"
                        >
                            <FcGoogle size={24} />
                            Sign In with Google
                        </button>
                        {/* 👆 KẾT THÚC KHU VỰC THÊM MỚI */}

                        {/* Footer Link */}
                        <p className="text-center text-sm text-gray-600 mt-auto pt-4">
                            Don’t have an account?{' '}
                            <span
                                className="text-[#C19D56] cursor-pointer hover:underline font-medium ml-1"
                                onClick={onSwitchToRegister}
                            >
                                Sign Up
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;