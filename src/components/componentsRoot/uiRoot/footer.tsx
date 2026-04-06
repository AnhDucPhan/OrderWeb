import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { IoLogoYoutube } from "react-icons/io";

const Footer = () => {
    return (
        <section>
            {/* Gộp class background, thêm overflow-hidden để chống lỗi tràn viền */}
            <footer className="relative bg-[#000000c9] bg-[url('/images/cof-bg-1-1.webp')] bg-cover bg-center bg-no-repeat text-white w-full py-16 lg:py-20 px-6 sm:px-10 lg:px-20 overflow-hidden">
                
                {/* Lớp phủ đen (Overlay) */}
                <div className="absolute inset-0 bg-black/80 z-0"></div>

                {/* Khung chứa nội dung (Giới hạn max-w để form không bè ra trên màn hình rộng) */}
                <div className="relative z-10 max-w-7xl mx-auto">
                    
                    {/* 👇 BÍ QUYẾT LÀ ĐÂY: Dùng Grid tự động chia cột */}
                    {/* Mobile: 1 cột | Tablet (sm): 2 cột | Desktop (lg): 4 cột */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                        {/* Phần 1: Address */}
                        <div className="flex flex-col gap-4">
                            <h5 className="font-marcellus text-[24px] lg:text-[26px] leading-[30px] capitalize relative pl-6">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                                Our Address
                            </h5>
                            <p className="font-dm-sans text-[#cdcdcd] text-base leading-[28px] border-b border-gray-400/30 pb-6 mb-2">
                                4821 Ridge Top Cir, Anchorage Street, Alaska 99508, United States America.
                            </p>

                            {/* Social Icons 2x2 */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                <span className="flex items-center gap-2 text-base lg:text-[18px] text-white hover:text-[#C19D56] transition-colors cursor-pointer group">
                                    <FaFacebook className="text-[#C19D56] text-xl lg:text-2xl transition-transform group-hover:scale-110" /> Facebook
                                </span>
                                <span className="flex items-center gap-2 text-base lg:text-[18px] text-white hover:text-[#C19D56] transition-colors cursor-pointer group">
                                    <FaInstagram className="text-[#C19D56] text-xl lg:text-2xl transition-transform group-hover:scale-110" /> Instagram
                                </span>
                                <span className="flex items-center gap-2 text-base lg:text-[18px] text-white hover:text-[#C19D56] transition-colors cursor-pointer group">
                                    <IoLogoLinkedin className="text-[#C19D56] text-xl lg:text-2xl transition-transform group-hover:scale-110" /> Linkedin
                                </span>
                                <span className="flex items-center gap-2 text-base lg:text-[18px] text-white hover:text-[#C19D56] transition-colors cursor-pointer group">
                                    <IoLogoYoutube className="text-[#C19D56] text-xl lg:text-2xl transition-transform group-hover:scale-110" /> Youtube
                                </span>
                            </div>
                        </div>

                        {/* Phần 2: Contact */}
                        <div className="flex flex-col gap-4 lg:pl-4">
                            <h5 className="font-marcellus text-[24px] lg:text-[26px] leading-[30px] capitalize relative pl-6">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                                Contact
                            </h5>
                            <div className="flex flex-col gap-3 font-dm-sans text-[#cdcdcd] text-base">
                                <a href="mailto:phanducanh2003@gmail.com" className="hover:text-[#C19D56] transition-colors break-all">
                                    phanducanh2003@gmail.com
                                </a>
                                <span>0867194***</span>
                                <a href="https://github.com/AnhDucPhan" target="_blank" rel="noreferrer" className="hover:text-[#C19D56] transition-colors">
                                    github.com/AnhDucPhan
                                </a>
                            </div>
                            <div className="mt-2">
                                <div className="text-[18px] lg:text-[20px] font-semibold text-white">09:00 AM - 08:00 PM</div>
                                <div className="font-dm-sans text-[#cdcdcd] text-base mt-1">Monday - Sunday</div>
                            </div>
                        </div>

                        {/* Phần 3: Services */}
                        <div className="flex flex-col gap-4 lg:pl-4">
                            <h5 className="font-marcellus text-[24px] lg:text-[26px] leading-[30px] capitalize relative pl-6">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                                Our Services
                            </h5>
                            {/* Chỉnh lại marker của thẻ ul cho đẹp */}
                            <ul className="list-none space-y-3 font-dm-sans text-[#cdcdcd] text-base">
                                <li className="hover:text-[#C19D56] hover:translate-x-1 transition-all cursor-pointer">Barista Training</li>
                                <li className="hover:text-[#C19D56] hover:translate-x-1 transition-all cursor-pointer">Coffee Tasting Events</li>
                                <li className="hover:text-[#C19D56] hover:translate-x-1 transition-all cursor-pointer">Seasonal Special Coffee</li>
                                <li className="hover:text-[#C19D56] hover:translate-x-1 transition-all cursor-pointer">Coffee Subscriptions</li>
                                <li className="hover:text-[#C19D56] hover:translate-x-1 transition-all cursor-pointer">Coffee Catering</li>
                            </ul>
                        </div>

                        {/* Phần 4: Newsletter */}
                        <div className="flex flex-col gap-4">
                            <h5 className="font-marcellus text-[24px] lg:text-[26px] leading-[30px] capitalize relative pl-6">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                                Our Newsletter
                            </h5>
                            <p className="font-dm-sans text-[#cdcdcd] text-base leading-[28px]">
                                Introduce your subscribers to the latest coffee trend—the Coconut Water Americano, a perfect summer drink.
                            </p>
                            
                            {/* Đã là Newsletter thì nên có 1 ô nhập Email giả lập cho chuẩn UX UI */}
                            <div className="mt-2 flex items-center bg-transparent border border-gray-400/50 rounded-lg overflow-hidden focus-within:border-[#C19D56] transition-colors">
                                <input 
                                    type="email" 
                                    placeholder="Your email address" 
                                    className="w-full bg-transparent px-4 py-3 text-sm text-white focus:outline-none placeholder:text-gray-500"
                                />
                                <button className="bg-[#C19D56] text-white px-5 py-3 text-sm font-semibold hover:bg-[#86624A] transition-colors h-full">
                                    SEND
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Phần Copyright nằm bên trong z-10 để không bị lớp Overlay đè lên */}
                    <div className="border-t border-gray-400/30 mt-16 pt-8 text-center font-dm-sans text-[#cdcdcd] text-sm sm:text-base">
                        © Copyright 2025. All rights reserved <span className="text-[#C19D56]">cofybrew</span>. Designed by Zozothemes
                    </div>

                </div>
            </footer>
        </section>
    )
}

export default Footer