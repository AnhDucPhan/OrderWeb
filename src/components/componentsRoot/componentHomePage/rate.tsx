import { BsArrowReturnRight } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const Rating = () => {
    return (
        <section className="py-16 lg:py-24 bg-gray-50 overflow-hidden font-marcellus">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-28 px-4 sm:px-6 lg:px-8">
                
                {/* ================= BÊN TRÁI: HÌNH ẢNH ================= */}
                <div className="w-full lg:w-1/2 flex justify-center relative">
                    <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px]">
                        {/* Dùng Image Next.js, sửa dấu /, thêm alt chuẩn SEO */}
                        <Image
                            src="/images/coffee-bg-Photoroom.png"
                            alt="Ly cà phê đặc sản thơm ngon chuẩn vị"
                            width={400}
                            height={533}
                            className="w-full h-auto aspect-[3/4] object-cover rounded-2xl shadow-xl transition-transform duration-500 hover:scale-105 relative z-10"
                        />
                        <div className="absolute top-4 -right-4 w-full h-full bg-[#C19D56] opacity-20 rounded-2xl -z-10"></div>
                    </div>
                </div>

                {/* ================= BÊN PHẢI: TEXT ================= */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-5 lg:gap-6">
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                        <div className="flex gap-1.5">
                            {[...Array(5)].map((_, index) => (
                                <FaStar key={index} className="text-[#C19D56] text-lg sm:text-xl drop-shadow-sm" />
                            ))}
                        </div>
                        <div className="font-dm-sans font-medium uppercase text-sm sm:text-base tracking-[1px] text-[#86624A]">
                            100.000 Đánh Giá 5 Sao
                        </div>
                    </div>

                    <h2 className="text-[#111111] text-4xl sm:text-5xl lg:text-[52px] leading-[1.1] lg:leading-[62px] tracking-[-1px]">
                        Trọn Vị Thư Thái, <br className="hidden lg:block"/> Đánh Thức Mọi Giác Quan
                    </h2>

                    <p className="font-dm-sans text-base sm:text-lg lg:text-xl text-gray-600 opacity-90 max-w-lg leading-relaxed">
                        Tận hưởng sự thư giãn và khám phá thế giới cà phê đậm đà, trọn vẹn hương vị trong từng ngụm!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto font-dm-sans">
                        
                        {/* Thay thế Button bằng Link để Bot Google có thể cào dữ liệu */}
                        <Link href="/shop/mushroom-coffee" className="w-full sm:w-auto flex items-center justify-center gap-3 border border-transparent rounded-lg bg-[#C19D56] px-8 py-3.5 hover:bg-[#86624A] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 group">
                            <span className="font-semibold text-white tracking-wide">
                                CÀ PHÊ LATTE
                            </span>
                            <BsArrowReturnRight className="text-white transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>

                        <Link href="/shop" className="w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-[#C19D56] rounded-lg px-8 py-3.5 hover:bg-[#C19D56] transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 group">
                            <span className="font-semibold text-[#C19D56] group-hover:text-white tracking-wide transition-colors">
                                ĐẶT HÀNG NGAY
                            </span>
                            <BsArrowReturnRight className="text-[#C19D56] group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>

                    </div>
                </div>

            </div>
        </section>
    )
}

export default Rating;