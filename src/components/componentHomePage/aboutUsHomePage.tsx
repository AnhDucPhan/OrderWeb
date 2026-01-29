import { BsArrowReturnRight } from "react-icons/bs"
import { GiCoffeeCup } from "react-icons/gi"
import { FaStar } from "react-icons/fa";

const AboutUs = () => {
    return (
        <div>
            <section className="relative z-10 flex flex-col md:flex-row w-full min-h-screen items-center">
                <div className="basis-1/2 flex items-center justify-center p-6 relative">
                    <img
                        src="/images/wemen-hompage.webp"
                        alt="Product"
                        className="w-full max-w-[550px] h-auto drop-shadow-xl object-contain"
                    />
                    {/* Lớp text nhấp nhô */}
                    <div className="absolute top-0 left-0 p-4 bounceY">
                        <div className="text-stroke-small font-marcellus">
                            COFFEE
                        </div>
                    </div>


                    <div className="
      absolute -bottom-10 left-1/2 -translate-x-1/2
      w-[625px] h-[180px] 
      bg-[#86624A] rounded-xl shadow-lg
      flex flex-col justify-between p-6 text-white
    ">
                        {/* Phần trên */}
                        <div className="flex-1">
                            {/* Nửa trái: chia 2 col */}
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-2 ">
                                    <div className="text-white mb-[6px] font-dm-sans text-[20px] font-semibold leading-[16px] tracking-[-0.2px]">
                                        Take Away Only
                                    </div>
                                    <div className="text-[#FCF8F4C9] mb-0 font-dm-sans text-[15px]">
                                        10:00 AM-08:00 PM
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-dm-sans text-[40px] font-bold leading-[46px] text-white">
                                        Since 1995
                                    </h4>
                                </div>
                            </div>
                        </div>

                        {/* Line ngăn cách */}
                        <div className="w-full h-[1px] bg-white opacity-20 my-4"></div>

                        {/* Phần dưới */}
                        <div className="flex justify-between">
                            <div className="flex flex-row flex-wrap justify-start gap-[10px] h-full p-0">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar key={index} className="text-[#C19D56]" />
                                ))}
                            </div>
                            <div className="font-dm-sans font-medium leading-[16px] tracking-[-0.2px] text-[#FCF8F4]">
                                Trust Score 4.5 (Based 1,200 reviews)
                            </div>
                        </div>

                    </div>
                </div>



                {/* Bên phải: Text */}
                <div className="basis-1/2 flex flex-col justify-center px-2 sm:px-4 md:px-6 lg:px-8 text-center md:text-left">
                    <div className="w-full md:max-w-none">
                        <span className="inline-flex gap-2 text-[#C19D56] text-sm sm:text-base md:text-lg font-medium">
                            <GiCoffeeCup />
                            ABOUT US
                        </span>

                        <h2 className="font-marcellus mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-black leading-[1.1] tracking-[-1px]">
                            Crafting Moments, One Brew at a Time
                        </h2>

                        <p className="font-dm-sans mt-2 text-base sm:text-lg md:text-lg lg:text-xl opacity-70 text-gray-700 leading-[1.3]">
                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 sm:pb-6">
                        <button className="border border-transparent rounded-lg bg-[#C19D56] px-5 py-2 text-white font-semibold hover:bg-[#86624A] transition-colors duration-300 flex items-center gap-3">
                            BOOK NOW
                            <BsArrowReturnRight />
                        </button>

                        <span className="flex items-center gap-2 px-4 py-1 text-[#C19D56] font-dm-sans cursor-pointer transition-colors duration-300 hover:text-[#86624A]">
                            EXPLORE MORE
                            <BsArrowReturnRight />
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <h5 className="text-[#111111] font-marcellus font-normal text-[20px]">How We Are</h5>
                        <div className="flex-1 h-[1px] bg-[#797979] opacity-20"></div>
                    </div>

                    <div className="flex w-full mt-4">
                        {/* Phần trái */}
                        <div className="w-1/2 flex flex-col items-start">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[28px] sm:text-[32px] md:text-[38px] lg:text-[50px] xl:text-[55px] 2xl:text-[60px] font-bold">45</span>
                                <span className="text-[28px] sm:text-[32px] md:text-[38px] lg:text-[50px] xl:text-[55px] 2xl:text-[60px] font-bold">+</span>
                            </div>
                            <div className="text-[#797979] text-[19px] leading-[36px] text-left">Countries</div>
                        </div>

                        {/* Phần phải */}
                        <div className="w-1/2 flex flex-col items-start">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[28px] sm:text-[32px] md:text-[38px] lg:text-[50px] xl:text-[55px] 2xl:text-[60px] font-bold">29</span>
                                <span className="text-[28px] sm:text-[32px] md:text-[38px] lg:text-[50px] xl:text-[55px] 2xl:text-[60px] font-bold">K</span>
                            </div>
                            <div className="text-[#797979] text-[19px] leading-[36px] text-left">Min Delivery</div>
                        </div>
                    </div>
                </div>


            </section>
        </div>
    )
}

export default AboutUs