'use client';

import Image from "next/image";
import { FaRegEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useState, Dispatch, SetStateAction } from "react";
import { useCreateUserMutation } from "@/services/userApi";
// 👇 1. Import hook tạo User từ RTK Query (Nhớ chỉnh lại đường dẫn cho đúng với dự án của bạn)

interface RegisterProps {
    openFormRegister: boolean;
    setOpenFormRegister: Dispatch<SetStateAction<boolean>>;
    onSwitchToLogin: () => void; 
}

const Register = ({ openFormRegister, setOpenFormRegister, onSwitchToLogin }: RegisterProps) => {
    
    // State form
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 👇 2. Lấy hàm tạo user và trạng thái loading từ RTK Query
    const [createUser, { isLoading }] = useCreateUserMutation();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setErrorMsg('');

        // 👇 3. Đóng gói dữ liệu vào FormData (vì BE của bạn có nhận file avatar)
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phoneNumber', phone); // Khớp với interface User của bạn
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', 'USER'); // Set role mặc định

        try {
            // 👇 4. Gọi API qua RTK Query và dùng .unwrap() để bắt lỗi dễ dàng
            await createUser(formData).unwrap();

            // Thành công
            alert("Tạo tài khoản thành công! Vui lòng đăng nhập.");
            
            // Xóa trắng form
            setName('');
            setPhone('');
            setEmail('');
            setPassword('');
            
            // Chuyển sang màn hình Đăng nhập
            onSwitchToLogin();

        } catch (error: any) {
            // Bắt lỗi từ Backend (Ví dụ: "Email đã tồn tại")
            console.error("Lỗi đăng ký:", error);
            
            // Nếu NestJS ném ra BadRequestException, lỗi thường nằm trong error.data.message
            const backendError = error?.data?.message;
            if (Array.isArray(backendError)) {
                setErrorMsg(backendError[0]); // Lỗi validation array của class-validator
            } else {
                setErrorMsg(backendError || "Đăng ký thất bại, vui lòng thử lại!");
            }
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
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="0987654321"
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

                            {/* Nút Submit tự động vô hiệu hóa (disabled) khi đang tải */}
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