import { BsArrowReturnRight } from "react-icons/bs"
import { GiCoffeeCup } from "react-icons/gi"
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
    return (
        <div className="w-full overflow-hidden font-marcellus">
            <section className="relative z-10 w-full max-w-7xl mx-auto min-h-screen px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-24 lg:gap-12">

                {/* ================= BÊN TRÁI: HÌNH ẢNH ================= */}
                <div className="w-full lg:w-1/2 flex items-center justify-center relative mt-10 lg:mt-0">
                    
                    <Image
                        src="/images/girl-Photoroom.png"
                        alt="Khách hàng thưởng thức cà phê hảo hạng tại quán của chúng tôi" 
                        width={550}
                        height={600}
                        className="w-full max-w-[350px] sm:max-w-[450px] lg:max-w-[550px] h-auto drop-shadow-2xl object-contain relative z-10"
                    />

                    <div className="absolute -top-10 sm:top-0 left-0 sm:left-4 bounceY z-0" aria-hidden="true">
                        <div className="text-stroke-small text-5xl sm:text-7xl opacity-30 lg:opacity-100">
                            CÀ PHÊ
                        </div>
                    </div>

                    {/* KHỐI NÂU NỔI (Floating Card) */}
                    <div className="
                        absolute -bottom-16 sm:-bottom-12 left-1/2 -translate-x-1/2 z-20
                        w-[95%] sm:w-[85%] max-w-[550px] 
                        bg-[#86624A] rounded-2xl shadow-2xl
                        flex flex-col justify-between p-5 sm:p-7 text-white
                    ">
                        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
                            <div className="flex flex-col gap-1 text-center sm:text-left">
                                <div className="text-lg sm:text-[20px] font-semibold tracking-wide">
                                    Chỉ Bán Tại Cửa Hàng
                                </div>
                                <div className="text-[#FCF8F4C9] text-sm sm:text-[15px]">
                                    10:00 Sáng - 08:00 Tối
                                </div>
                            </div>
                            <div className="text-center sm:text-right">
                                <h3 className="text-3xl sm:text-[40px] font-bold text-white">
                                    Từ 1995
                                </h3>
                            </div>
                        </div>

                        <div className="w-full h-[1px] bg-white opacity-20 my-4 sm:my-5"></div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                            <div className="flex gap-1.5">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar key={index} className="text-[#C19D56] text-sm sm:text-base" />
                                ))}
                            </div>
                            <div className="font-medium text-sm sm:text-base text-[#FCF8F4] text-center">
                                Điểm Tin Cậy 4.5 <span className="opacity-80 font-normal">(1.200 đánh giá)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= BÊN PHẢI: TEXT ================= */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left z-10">

                    <span className="inline-flex justify-center lg:justify-start items-center gap-2 text-[#C19D56] text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase">
                        <GiCoffeeCup className="text-xl" />
                        Về Chúng Tôi
                    </span>

                    <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl text-black leading-tight">
                        Kiến Tạo Khoảnh Khắc, <br className="hidden lg:block" /> Trọn Vị Từng Ly
                    </h2>

                    <p className="mt-5 sm:mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        Tại quán cà phê của chúng tôi, mỗi ly cà phê không chỉ là một thức uống mà còn là một câu chuyện. Từ việc tuyển chọn những hạt cà phê cao cấp nhất đến nghệ thuật pha chế tỉ mỉ, chúng tôi tận tâm mang đến cho bạn những giây phút ấm áp, thư giãn và kết nối trọn vẹn nhất.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 mt-8">
                        <Link href="/shop" className="w-full sm:w-auto border border-transparent rounded-lg bg-[#C19D56] px-8 py-3.5 text-white font-semibold hover:bg-[#86624A] hover:-translate-y-1 shadow-lg transition-all duration-300 flex items-center justify-center gap-3 group">
                            ĐẶT HÀNG NGAY
                            <BsArrowReturnRight className="transition-transform group-hover:translate-x-1" />
                        </Link>

                        <Link href="/about" className="flex items-center justify-center gap-2 px-4 py-2 text-[#C19D56] font-semibold cursor-pointer transition-colors duration-300 hover:text-[#86624A] group">
                            KHÁM PHÁ THÊM
                            <BsArrowReturnRight className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 mt-12 mb-8">
                        <h3 className="text-[#111111] text-xl whitespace-nowrap">Thành Tựu Của Chúng Tôi</h3>
                        <div className="flex-1 h-[1px] bg-gray-300"></div>
                    </div>

                    <div className="flex justify-center lg:justify-start gap-12 sm:gap-20">
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="flex items-baseline font-bold text-5xl sm:text-6xl text-black">
                                45<span className="text-[#C19D56]">+</span>
                            </div>
                            <div className="text-gray-500 text-lg mt-1 font-medium">Cửa Hàng</div>
                        </div>

                        <div className="flex flex-col items-center lg:items-start">
                            <div className="flex items-baseline font-bold text-5xl sm:text-6xl text-black">
                                29<span className="text-[#C19D56]">K</span>
                            </div>
                            <div className="text-gray-500 text-lg mt-1 font-medium">Khách Hàng</div>
                        </div>
                    </div>

                </div>

            </section>
        </div>
    )
}

export default AboutUs