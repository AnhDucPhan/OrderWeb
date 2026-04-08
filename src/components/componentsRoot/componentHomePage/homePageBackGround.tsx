import Link from "next/link";
import { BsArrowReturnRight } from "react-icons/bs";

const HomePageBackGround = () => {
    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#100A08]">

            {/* 1. Ảnh nền & Lớp phủ bảo vệ (Overlay) */}
            <img
                src="images\bg-2.jpg" // Sửa lại dấu gạch chéo chuẩn Web
                alt="background"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            {/* Thêm lớp gradient từ trái sang phải để làm nổi bật chữ bên trái */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#100A08]/90 via-[#100A08]/50 to-transparent z-0"></div>

            {/* 2. Container chính (Khóa max-width để không bị loãng trên màn hình to) */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 sm:px-8 md:px-12 lg:px-16 py-24 md:py-32 gap-12 md:gap-8">

                {/* Cột Trái: Text */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mt-10 md:mt-0">
                    {/* Đổi màu subtitle sang vàng gold để tone-sur-tone với nút bấm */}
                    <span className="text-[#C19D56] text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase tracking-widest drop-shadow-md">
                        Cà phê chuẩn vị mỗi ngày
                    </span>

                    <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-extrabold leading-tight drop-shadow-lg">
                        Khởi đầu ngày mới cùng cà phê <br className="hidden lg:block" /> Thưởng thức cà phê đúng nghĩa
                    </h1>

                    <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-300 drop-shadow max-w-md lg:max-w-lg leading-relaxed">
                        Một ly cà phê, vạn niềm vui
                    </p>

                    <Link href='/shop'>
                        <button className="mt-8 flex items-center justify-center gap-3 border border-transparent rounded-lg bg-[#C19D56] px-8 py-3.5 hover:bg-[#86624A] hover:border-[#C19D56] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group">
                            <span className="font-semibold text-white tracking-wide">
                                Mua Ngay
                            </span>
                            <BsArrowReturnRight className="text-xl text-white transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </Link>
                </div>

                {/* Cột Phải: Hình ảnh */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center">
                    <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[500px]">
                        <img
                            src="images\coffee-bg-Photoroom.png"
                            alt="mockup"
                            className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105 hover:rotate-2 cursor-pointer"
                        />
                        {/* Hiệu ứng ánh sáng hắt ra từ sau ly nước (Tùy chọn, tạo cảm giác 3D) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#C19D56] opacity-20 blur-[80px] -z-10 rounded-full pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePageBackGround;  