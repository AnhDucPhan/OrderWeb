import { BsArrowReturnRight } from "react-icons/bs";

const HomePageBackGround = () => {
    return (
        <div className="relative">
            {/* <div className="absolute top-0 left-0 w-full z-50">
                <Header />
            </div> */}

            <div className="relative w-full h-[150vh] flex">
                {/* Lớp nền nâu đặc */}
                <div className="absolute inset-0 bg-[#100A08]"></div>

                {/* Ảnh nền */}
                <img
                    src="/images/bg-homepage.png"
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />

                {/* Content chia 2 bên */}
                <div className="relative z-10 flex w-full">
                    {/* Bên trái: Text */}
                    <div className="flex-1 flex flex-col justify-center 
                pl-4 sm:pl-8 md:pl-16 lg:pl-24 xl:pl-32">
                        <span className="text-white text-lg md:text-3xl font-bold drop-shadow-lg">
                            COFFEE AND TEA
                        </span>
                        <h1 className="mt-4 text-5xl md:text-7xl text-gray-200 drop-shadow">
                            Awaken Your Taste Buds Today!
                        </h1>
                        <p className="mt-4 text-lg md:text-3xl text-gray-200 drop-shadow">
                            Let's transform your online potential into measurable growth
                        </p>
                        <button className="self-start w-fit mt-6 sm:mt-8 md:mt-10 lg:mt-12 border border-transparent rounded-lg bg-[#C19D56] px-6 py-2 hover:bg-[#86624A] hover:border-[#C19D56] transition-colors duration-300">
                            <span className="flex items-center gap-4">
                                BUY NOW
                                <BsArrowReturnRight />
                            </span>
                        </button>

                    </div>


                    <div className="flex-1 flex items-center justify-center">
                        <img
                            src="/images/shake.webp"
                            alt="mockup"
                            className="q
      w-3/4 h-auto              /* Mobile/tablet: chiếm 3/4 chiều ngang */
      md:w-[400px] md:h-[650px] /* Desktop: giữ đúng 300x550 */
      drop-shadow-xl    
    "
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePageBackGround;