import { FaCheck } from "react-icons/fa6";
import { GiCoffeeCup } from "react-icons/gi";


const WhyChooseUs = () => {
    return (
        <section className="bg-[#FCF8F4] w-full min-h-screen flex flex-col md:flex-row items-center px-6 sm:px-10 lg:px-20 py-12">
            {/* Bên trái: Text */}
            <div className="basis-1/2 flex flex-col justify-center text-center md:text-left px-4">
                <span className="inline-flex gap-2 text-[#C19D56] text-sm sm:text-base md:text-lg font-medium">
                    <GiCoffeeCup />
                    WHY CHOOSE US
                </span>

                <h2 className="font-marcellus mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black leading-snug">
                    Crafting Moments, One Brew at a Time
                </h2>

                <p className="font-dm-sans mt-4 text-base sm:text-lg md:text-xl text-gray-700 opacity-80 max-w-xl mx-auto md:mx-0">
                    At our coffee shop, every cup tells a story. From the careful selection of premium beans
                    to the artful brewing process, we are dedicated to creating moments of warmth, comfort, and connection.
                </p>

                {/* Features */}
                <div className="mt-8 space-y-8">
                    {/* Hàng 1: 3 item */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="check text-[#C19D56] text-2xl"><FaCheck /></div>
                            <h5 className="font-dm-sans font-semibold text-lg text-gray-900">A Cleared Mind</h5>
                        </div>

                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="check text-[#C19D56] text-2xl"><FaCheck /></div>
                            <h5 className="font-dm-sans font-semibold text-lg text-gray-900">Boost Of Energy</h5>
                        </div>

                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="check text-[#C19D56] text-2xl"><FaCheck /></div>
                            <h5 className="font-dm-sans font-semibold text-lg text-gray-900">A Science Backed</h5>
                        </div>
                    </div>

                    {/* Hàng 2: 2 item căn giữa */}
                    <div className="flex justify-center gap-6">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="check text-[#C19D56] text-2xl"><FaCheck /></div>
                            <h5 className="font-dm-sans font-semibold text-lg text-gray-900">A Cleared Mind</h5>
                        </div>

                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="check text-[#C19D56] text-2xl"><FaCheck /></div>
                            <h5 className="font-dm-sans font-semibold text-lg text-gray-900">Boost Of Energy</h5>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-6">
                {/* Ảnh trên cùng */}
                <img
                    src="/images/cof.png"
                    alt="Coffee"
                    className="w-auto h-[150px] sm:h-[180px] md:h-[200px] lg:h-[300px] drop-shadow-xl object-contain rounded-2xl transform translate-x-40"
                />

                {/* Hàng ngang bên dưới */}
                <div className="flex items-center justify-center space-x-6">
                    {/* Coffee Bean */}
                    <img
                        src="/images/Coffee-Bean.png"
                        alt="Coffee Bean"
                        className="w-[130px] object-contain h-full spin-slow opacity-25"
                    />

                    {/* Coffee Bag */}
                    <img
                        src="/images/coffee-bag-1.webp"
                        alt="Coffee Bag"
                        className="w-auto h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] drop-shadow-xl object-contain rounded-2xl"
                    />
                </div>
            </div>



        </section>


    )
}

export default WhyChooseUs