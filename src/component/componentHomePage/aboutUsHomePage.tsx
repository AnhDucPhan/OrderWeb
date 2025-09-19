import { BsArrowReturnRight } from "react-icons/bs"
import { GiCoffeeCup } from "react-icons/gi"

const AboutUs = () => {
    return (
        <div>
            <section className="relative z-10 flex flex-col md:flex-row w-full min-h-screen items-center">
                {/* Bên trái: Hình ảnh */}
                <div className="basis-1/2 flex items-center justify-center p-6">
                    <img
                        src="/images/wemen-hompage.webp"
                        alt="Product"
                        className="w-full max-w-[550px] h-auto drop-shadow-xl object-contain"
                    />
                </div>

                {/* Bên phải: Text */}
                <div
                    className="basis-1/2 flex flex-col justify-center 
      px-6 sm:px-10 md:px-12 lg:px-16 xl:px-24
      text-center md:text-left"
                >
                    <div className="max-w-lg mx-auto md:mx-0">
                        <span className="inline-flex gap-2 text-[#C19D56] text-sm sm:text-base md:text-xl  font-medium   ">
                            <GiCoffeeCup />
                            ABOUT US
                        </span>

                        <h2 className="font-marcellus mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
               text-black leading-[62px] tracking-[-1px]">
                            Crafting Moments, One Brew at a Time
                        </h2>


                        <p className="font-dm-sans mt-4 text-base sm:text-lg md:text-xl opacity-70 text-gray-700">
                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                        {/* Button BOOK NOW */}
                        <button
                            className="self-start sm:self-auto mt-6 sm:mt-8 md:mt-10 lg:mt-12 
        border border-transparent rounded-lg bg-[#C19D56] px-6 py-2 
        text-white font-semibold
        hover:bg-[#86624A] hover:border-[#C19D56] 
        transition-colors duration-300 flex items-center gap-4"
                        >
                            BOOK NOW
                            <BsArrowReturnRight />
                        </button>

                        {/* Text EXPLORE MORE */}
                        <span
                            className="flex items-center gap-2 self-start sm:self-auto mt-4 sm:mt-8 md:mt-10 lg:mt-12 
        px-6 py-2
        text-[#C19D56] font-semibold cursor-pointer 
        transition-colors duration-300 hover:text-[#86624A]"
                        >
                            EXPLORE MORE
                            <BsArrowReturnRight />
                        </span>
                    </div>
                </div>
            </section>


        </div>
    )
}

export default AboutUs