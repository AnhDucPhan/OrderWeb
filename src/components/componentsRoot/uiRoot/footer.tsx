"use client";


import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { IoLogoYoutube } from "react-icons/io";
import Link from "next/link"; // Quan trọng: Import Link cho SEO nội bộ

const Footer = () => {
    return (
        // Xóa thẻ <section> thừa, dùng luôn <footer> làm thẻ gốc để chuẩn Semantic
        <footer className="shrink-0 relative bg-[#000000c9] bg-[url('/images/cof-bg-1-1.webp')] bg-cover bg-center bg-no-repeat text-white w-full py-16 lg:py-20 px-4 sm:px-10 lg:px-20 overflow-hidden font-marcellus">

            {/* Lớp phủ đen (Overlay) */}
            <div className="absolute inset-0 bg-black/80 z-0"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Phần 1: Address */}
                    <div className="flex flex-col gap-4">
                        {/* SEO: Đổi h5 thành h3 */}
                        <h3 className="text-[24px] lg:text-[26px] leading-[30px] capitalize relative pl-6">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                            Địa Chỉ
                        </h3>
                        <p className="font-dm-sans text-[#cdcdcd] text-base leading-[28px] border-b border-gray-400/30 pb-6 mb-2">
                            4821 Ridge Top Cir, Anchorage Street, Alaska 99508, Hoa Kỳ.
                        </p>

                        {/* Social Icons 2x2 - SEO: Đổi span thành thẻ a có href và rel */}
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 font-dm-sans">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex items-center gap-2 text-base lg:text-[18px] text-white hover:text-[#C19D56] transition-colors group">
                                <FaFacebook className="text-[#C19D56] text-xl lg:text-2xl transition-transform group-hover:scale-110" /> Facebook
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center gap-2 text-base lg:text-[18px] text-white hover:text-[#C19D56] transition-colors group">
                                <FaInstagram className="text-[#C19D56] text-xl lg:text-2xl transition-transform group-hover:scale-110" /> Instagram
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center gap-2 text-base lg:text-[18px] text-white hover:text-[#C19D56] transition-colors group">
                                <IoLogoLinkedin className="text-[#C19D56] text-xl lg:text-2xl transition-transform group-hover:scale-110" /> Linkedin
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube" className="flex items-center gap-2 text-base lg:text-[18px] text-white hover:text-[#C19D56] transition-colors group">
                                <IoLogoYoutube className="text-[#C19D56] text-xl lg:text-2xl transition-transform group-hover:scale-110" /> Youtube
                            </a>
                        </div>
                    </div>

                    {/* Phần 2: Contact */}
                    <div className="flex flex-col gap-4 lg:pl-4">
                        <h3 className="text-[24px] lg:text-[26px] leading-[30px] capitalize relative pl-6">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                            Liên Hệ
                        </h3>
                        <div className="flex flex-col gap-3 font-dm-sans text-[#cdcdcd] text-base">
                            <a href="mailto:phanducanh2003@gmail.com" className="hover:text-[#C19D56] transition-colors break-all">
                                phanducanh2003@gmail.com
                            </a>
                            {/* SEO: Thêm href tel: để click gọi điện trên mobile */}
                            <a href="tel:0867194000" className="hover:text-[#C19D56] transition-colors">
                                0867 194 ***
                            </a>
                            <a href="https://github.com/AnhDucPhan" target="_blank" rel="noopener noreferrer" className="hover:text-[#C19D56] transition-colors">
                                github.com/AnhDucPhan
                            </a>
                        </div>
                        <div className="mt-2">
                            <div className="text-[18px] lg:text-[20px] font-semibold text-white">09:00 Sáng - 08:00 Tối</div>
                            <div className="font-dm-sans text-[#cdcdcd] text-base mt-1">Thứ Hai - Chủ Nhật</div>
                        </div>
                    </div>

                    {/* Phần 3: Services */}
                    <div className="flex flex-col gap-4 lg:pl-4">
                        <h3 className="text-[24px] lg:text-[26px] leading-[30px] capitalize relative pl-6">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                            Dịch Vụ
                        </h3>
                        {/* SEO: Dùng Link của Next.js cho Internal Linking */}
                        <ul className="list-none space-y-3 font-dm-sans text-[#cdcdcd] text-base">
                            <li><Link href="/services/barista" className="inline-block hover:text-[#C19D56] hover:translate-x-1 transition-all">Đào Tạo Barista</Link></li>
                            <li><Link href="/services/tasting" className="inline-block hover:text-[#C19D56] hover:translate-x-1 transition-all">Sự Kiện Thử Nếm Cà Phê</Link></li>
                            <li><Link href="/services/specialty" className="inline-block hover:text-[#C19D56] hover:translate-x-1 transition-all">Cà Phê Đặc Sản Theo Mùa</Link></li>
                            <li><Link href="/services/subscription" className="inline-block hover:text-[#C19D56] hover:translate-x-1 transition-all">Gói Đăng Ký Cà Phê</Link></li>
                            <li><Link href="/services/catering" className="inline-block hover:text-[#C19D56] hover:translate-x-1 transition-all">Dịch Vụ Tiệc Cà Phê</Link></li>
                        </ul>
                    </div>

                    {/* Phần 4: Newsletter */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[24px] lg:text-[26px] leading-[30px] capitalize relative pl-6">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                            Đăng Ký Nhận Tin
                        </h3>
                        <p className="font-dm-sans text-[#cdcdcd] text-base leading-[28px]">
                            Đừng bỏ lỡ những xu hướng cà phê mới nhất—ví dụ như Americano Nước Dừa, thức uống giải nhiệt hoàn hảo cho mùa hè.
                        </p>

                        {/* Form Newsletter */}
                        <form className="mt-2 flex items-center bg-transparent border border-gray-400/50 rounded-lg overflow-hidden focus-within:border-[#C19D56] transition-colors" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Địa chỉ email của bạn"
                                required
                                className="w-full bg-transparent font-dm-sans px-4 py-3 text-sm text-white focus:outline-none placeholder:text-gray-500"
                            />
                            <button type="submit" className="bg-[#C19D56] font-dm-sans text-white px-5 py-3 text-sm font-semibold hover:bg-[#86624A] transition-colors h-full">
                                GỬI
                            </button>
                        </form>
                    </div>
                </div>

                {/* Phần Copyright */}
                <div className="border-t border-gray-400/30 mt-16 pt-8 text-center font-dm-sans text-[#cdcdcd] text-sm sm:text-base">
                     Thiết kế bởi Anh Phan.
                </div>

            </div>
        </footer>
    );
}

export default Footer;