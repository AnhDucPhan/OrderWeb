import { BsArrowReturnRight } from "react-icons/bs"
import { GiCoffeeCup } from "react-icons/gi"
import { FaStar } from "react-icons/fa";

const AboutUs = () => {
    return (
        // Thêm max-w-7xl và mx-auto để giới hạn chiều rộng trên màn hình siêu to
        <div className="w-full overflow-hidden">
            <section className="relative z-10 w-full max-w-7xl mx-auto min-h-screen px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-24 lg:gap-12">
                
                {/* ================= BÊN TRÁI: HÌNH ẢNH ================= */}
                {/* Đổi basis-1/2 thành w-full lg:w-1/2 */}
                <div className="w-full lg:w-1/2 flex items-center justify-center relative mt-10 lg:mt-0">
                    <img
                        src="/images/wemen-hompage.webp"
                        alt="Product"
                        // Thêm max-w-[400px] cho mobile để ảnh không bị bự quá
                        className="w-full max-w-[350px] sm:max-w-[450px] lg:max-w-[550px] h-auto drop-shadow-2xl object-contain relative z-10"
                    />
                    
                    {/* Lớp text nhấp nhô - Canh lại vị trí cho mobile */}
                    <div className="absolute -top-10 sm:top-0 left-0 sm:left-4 bounceY z-0">
                        <div className="text-stroke-small font-marcellus text-5xl sm:text-7xl opacity-30 lg:opacity-100">
                            COFFEE
                        </div>
                    </div>

                    {/* KHỐI NÂU NỔI (Floating Card) */}
                    {/* Bỏ w-[625px] thay bằng w-[95%] max-w-[550px] để co giãn tốt trên điện thoại */}
                    <div className="
                        absolute -bottom-16 sm:-bottom-12 left-1/2 -translate-x-1/2 z-20
                        w-[95%] sm:w-[85%] max-w-[550px] 
                        bg-[#86624A] rounded-2xl shadow-2xl
                        flex flex-col justify-between p-5 sm:p-7 text-white
                    ">
                        {/* Phần trên */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
                            <div className="flex flex-col gap-1 text-center sm:text-left">
                                <div className="font-dm-sans text-lg sm:text-[20px] font-semibold tracking-wide">
                                    Take Away Only
                                </div>
                                <div className="text-[#FCF8F4C9] font-dm-sans text-sm sm:text-[15px]">
                                    10:00 AM - 08:00 PM
                                </div>
                            </div>
                            <div className="text-center sm:text-right">
                                <h4 className="font-dm-sans text-3xl sm:text-[40px] font-bold text-white">
                                    Since 1995
                                </h4>
                            </div>
                        </div>

                        {/* Line ngăn cách */}
                        <div className="w-full h-[1px] bg-white opacity-20 my-4 sm:my-5"></div>

                        {/* Phần dưới */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                            <div className="flex gap-1.5">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar key={index} className="text-[#C19D56] text-sm sm:text-base" />
                                ))}
                            </div>
                            <div className="font-dm-sans font-medium text-sm sm:text-base text-[#FCF8F4] text-center">
                                Trust Score 4.5 <span className="opacity-80 font-normal">(1,200 reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= BÊN PHẢI: TEXT ================= */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left z-10">
                    
                    <span className="inline-flex justify-center lg:justify-start items-center gap-2 text-[#C19D56] text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase">
                        <GiCoffeeCup className="text-xl" />
                        About Us
                    </span>

                    {/* Dùng Tailwind Typography chuẩn thay vì fix số pixel */}
                    <h2 className="font-marcellus mt-4 text-4xl sm:text-5xl lg:text-6xl text-black leading-tight">
                        Crafting Moments, <br className="hidden lg:block"/> One Brew at a Time
                    </h2>

                    <p className="font-dm-sans mt-5 sm:mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 mt-8">
                        <button className="w-full sm:w-auto border border-transparent rounded-lg bg-[#C19D56] px-8 py-3.5 text-white font-semibold hover:bg-[#86624A] hover:-translate-y-1 shadow-lg transition-all duration-300 flex items-center justify-center gap-3 group">
                            BOOK NOW
                            <BsArrowReturnRight className="transition-transform group-hover:translate-x-1" />
                        </button>

                        <span className="flex items-center justify-center gap-2 px-4 py-2 text-[#C19D56] font-semibold cursor-pointer transition-colors duration-300 hover:text-[#86624A] group">
                            EXPLORE MORE
                            <BsArrowReturnRight className="transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>

                    {/* Đường gạch ngang "How We Are" */}
                    <div className="flex items-center gap-4 mt-12 mb-8">
                        <h5 className="text-[#111111] font-marcellus text-xl whitespace-nowrap">How We Are</h5>
                        <div className="flex-1 h-[1px] bg-gray-300"></div>
                    </div>

                    {/* Số liệu thống kê */}
                    <div className="flex justify-center lg:justify-start gap-12 sm:gap-20">
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="flex items-baseline font-bold text-5xl sm:text-6xl text-black">
                                45<span className="text-[#C19D56]">+</span>
                            </div>
                            <div className="text-gray-500 text-lg mt-1 font-medium">Countries</div>
                        </div>

                        <div className="flex flex-col items-center lg:items-start">
                            <div className="flex items-baseline font-bold text-5xl sm:text-6xl text-black">
                                29<span className="text-[#C19D56]">K</span>
                            </div>
                            <div className="text-gray-500 text-lg mt-1 font-medium">Min Delivery</div>
                        </div>
                    </div>

                </div>

            </section>
        </div>
    )
}

export default AboutUs