import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { IoLogoYoutube } from "react-icons/io";

const Footer = () => {
    return (
        <section>
            <footer className=" bg-[url('/images/cof-bg-1-1.webp')] relative bg-[#000000c9] bg-cover bg-center bg-no-repeat text-white w-full py-12 px-6 sm:px-10 lg:px-20">
            <div className="absolute inset-0 bg-black/70"></div>
                <div className="flex flex-col md:flex-row justify-between gap-8">

                    {/* Phần 1: Address */}
                    <div className="z-10 flex-1 flex flex-col gap-4">
                        <h5 className="text-[26px] leading-[30px] capitalize mb-4 relative pl-6">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                            Our Address
                        </h5>
                        <p className="text-[#cdcdcd] text-[16px] leading-[30px] border-b border-gray-400/30 pb-4 mb-4">
                            4821 Ridge Top Cir, Anchorage Street, Alaska 99508, United States America.
                        </p>

                        {/* Social Icons 2x2 */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <span className="flex items-center gap-2 text-[20px] text-white hover:text-[#f0d56b] transition-colors cursor-pointer">
                                <FaFacebook className="text-[#C19D56] text-2xl" /> Facebook
                            </span>
                            <span className="flex items-center gap-2 text-[20px] text-white hover:text-[#f0d56b] transition-colors cursor-pointer">
                                <FaInstagram className="text-[#C19D56] text-2xl" /> Instagram
                            </span>
                            <span className="flex items-center gap-2 text-[20px] text-white hover:text-[#f0d56b] transition-colors cursor-pointer">
                                <IoLogoLinkedin className="text-[#C19D56] text-2xl" /> Linkedin
                            </span>
                            <span className="flex items-center gap-2 text-[20px] text-white hover:text-[#f0d56b] transition-colors cursor-pointer">
                                <IoLogoYoutube className="text-[#C19D56] text-2xl" /> Youtube
                            </span>
                        </div>
                    </div>

                    {/* Phần 2: Contact */}
                    <div className="flex-1 z-10 flex flex-col gap-4">
                        <h5 className="text-[26px] leading-[30px] capitalize mb-4 relative pl-6">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                            Contact
                        </h5>
                        <div className="flex flex-col gap-2 text-[#cdcdcd] text-[16px] leading-[30px]">
                            <a href="mailto:phanducanh2003@gmail.com">phanducanh2003@gmail.com</a>
                            <span>0867194***</span>
                            <a href="https://github.com/AnhDucPhan" target="_blank" rel="noreferrer">github.com/AnhDucPhan</a>
                        </div>
                        <div className="text-[20px] leading-[33px] font-semibold text-white">09:00 AM - 08:00 PM</div>
                        <div className="text-[#cdcdcd] text-[16px] leading-[30px]">Monday - Sunday</div>
                    </div>

                    {/* Phần 3: Services */}
                    <div className="flex-1 z-10 flex flex-col gap-2">
                        <h5 className="text-[26px] leading-[30px] capitalize mb-4 relative pl-6">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                            Our Services
                        </h5>
                        <ul className="list-disc pl-6 space-y-2 text-[#cdcdcd] text-[16px] leading-[23px]">
                            <li>Barista Training</li>
                            <li>Coffee Tasting Events</li>
                            <li>Seasonal Special Coffee</li>
                            <li>Coffee Subscriptions</li>
                            <li>Coffee Catering</li>
                        </ul>
                    </div>

                    {/* Phần 4: Description */}
                    <div className="flex-1 z-10 flex flex-col gap-4">
                        <h5 className="text-[26px] leading-[30px] capitalize mb-4 relative pl-6">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C19D56]">•</span>
                            Our Newsletter
                        </h5>
                        <p className="text-[#cdcdcd] text-[16px] leading-[30px]">
                            Introduce your subscribers to the latest coffee trend—the Coconut Water Americano, a perfect summer drink.
                        </p>
                    </div>
                </div>
                <div className="border-b border-gray-400/30 my-8"></div>
                <div className="z-10">
                    <p className="flex justify-center items-center">© Copyright 2025. All rights reserved cofybrew. Designed by Zozothemes</p>
                </div>
            </footer>
        </section>


    )
}

export default Footer