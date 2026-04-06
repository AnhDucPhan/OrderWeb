import { FaCheck } from "react-icons/fa6";
import { GiCoffeeCup } from "react-icons/gi";

const WhyChooseUs = () => {
    const features = [
        "A Cleared Mind",
        "Boost Of Energy",
        "A Science Backed",
        "A Cleared Mind",
        "Boost Of Energy"
    ];

    return (
        <section className="bg-[#FCF8F4] w-full min-h-screen py-16 lg:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

                {/* ================= BÊN TRÁI: TEXT ================= */}
                {/* Giữ nguyên z-10 để chữ luôn nổi lên trên, có thể đọc được nếu ảnh chạm vào */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left relative z-10">
                    <span className="inline-flex justify-center lg:justify-start items-center gap-2 text-[#C19D56] text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase">
                        <GiCoffeeCup className="text-xl" />
                        WHY CHOOSE US
                    </span>

                    <h2 className="font-marcellus mt-4 text-4xl sm:text-5xl md:text-6xl text-black leading-[1.1] tracking-[-1px]">
                        Crafting Moments, <br className="hidden lg:block" /> One Brew at a Time
                    </h2>

                    <p className="font-dm-sans mt-5 sm:mt-6 text-base sm:text-lg text-gray-700 opacity-80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        At our coffee shop, every cup tells a story. From the careful selection of premium beans
                        to the artful brewing process, we are dedicated to creating moments of warmth, comfort, and connection.
                    </p>

                    <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
                        {features.map((item, index) => (
                            <div key={index} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#C19D56] text-lg">
                                    <FaCheck />
                                </div>
                                <h5 className="font-dm-sans font-semibold text-base sm:text-lg text-gray-900 leading-tight">
                                    {item}
                                </h5>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= BÊN PHẢI: HÌNH ẢNH ================= */}
                {/* 👇 SỬA LỖI Ở ĐÂY: XÓA `overflow-hidden`, THÊM `relative z-0` */}
                <div className="basis-1/2 flex flex-col items-center mt-12 md:mt-0 w-full relative z-0">

                    {/* Ảnh trên cùng (Ly cà phê) */}
                    <img
                        src="/images/cof.png"
                        alt="Coffee"
                        className="
                        w-auto drop-shadow-xl object-contain rounded-2xl transform 
                        h-[120px] sm:h-[180px] md:h-[200px] lg:h-[300px] 
                        translate-x-12 sm:translate-x-24 md:translate-x-32 lg:translate-x-40 
                        relative z-20
                    "
                    />

                    {/* Hàng ngang bên dưới (Hạt & Túi) */}
                    <div className="flex items-center justify-center space-x-2 sm:space-x-6 -mt-8 sm:-mt-12 lg:-mt-20 relative z-10">

                        {/* Coffee Bean */}
                        <img
                            src="/images/Coffee-Bean.png"
                            alt="Coffee Bean"
                            className="
                            w-[70px] sm:w-[100px] lg:w-[130px] 
                            object-contain h-full spin-slow opacity-25
                        "
                        />

                        {/* Coffee Bag */}
                        <img
                            src="/images/coffee-bag-1.webp"
                            alt="Coffee Bag"
                            className="
                            w-auto drop-shadow-2xl object-contain rounded-2xl
                            h-[220px] sm:h-[320px] md:h-[380px] lg:h-[420px] 
                        "
                        />
                    </div>
                </div>

            </div>
        </section>
    )
}

export default WhyChooseUs