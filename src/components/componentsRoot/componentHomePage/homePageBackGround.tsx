import { BsArrowReturnRight } from "react-icons/bs";

const HomePageBackGround = () => {
    return (
        <div className="relative">
            {/* Đổi h-[150vh] thành min-h-screen để màn hình tự động co giãn chiều cao cho vừa vặn */}
            <div className="relative w-full min-h-screen flex flex-col md:flex-row">
                
                {/* Lớp nền nâu đặc */}
                <div className="absolute inset-0 bg-[#100A08]"></div>

                {/* Ảnh nền */}
                <img
                    src="images\bg-homepage.png"
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />

                {/* Content: Đã thêm flex-col cho mobile và md:flex-row cho desktop */}
                <div className="relative z-10 flex flex-col md:flex-row w-full items-center py-20 md:py-0">
                    
                    {/* Bên trái: Text */}
                    <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:pl-16 lg:pl-24 xl:pl-32 text-center md:text-left mb-12 md:mb-0">
                        <span className="text-white text-lg md:text-3xl font-bold drop-shadow-lg uppercase tracking-wider">
                            COFFEE AND TEA
                        </span>
                        <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl text-gray-200 drop-shadow-lg font-bold leading-tight">
                            Awaken Your Taste Buds Today!
                        </h1>
                        <p className="mt-4 text-base sm:text-lg md:text-2xl text-gray-300 drop-shadow max-w-2xl mx-auto md:mx-0">
                            Let's transform your online potential into measurable growth
                        </p>
                        <button className="mx-auto md:mx-0 w-fit mt-8 border border-transparent rounded-lg bg-[#C19D56] px-8 py-3 hover:bg-[#86624A] hover:border-[#C19D56] transition-all duration-300 shadow-lg hover:shadow-xl">
                            <span className="flex items-center gap-3 font-semibold text-white">
                                BUY NOW
                                <BsArrowReturnRight className="text-xl" />
                            </span>
                        </button>
                    </div>

                    {/* Bên phải: Hình ảnh Responsive */}
                    <div className="flex-1 flex items-center justify-center w-full px-6">
                        <img
                            src="/images/shake.webp"
                            alt="mockup"
                            // Dùng w-full kết hợp max-w để ảnh tự động scale theo màn hình
                            className="
                                w-full h-auto object-contain
                                max-w-[250px]       /* Mobile: max 250px */
                                sm:max-w-[300px]    /* Tablet nhỏ: max 300px */
                                md:max-w-[400px]    /* Laptop: max 400px */
                                lg:max-w-[500px]    /* Màn hình lớn: max 500px */
                                drop-shadow-2xl 
                                transition-transform duration-500 hover:scale-105 /* Thêm hiệu ứng hover cho xịn */
                            "
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePageBackGround;