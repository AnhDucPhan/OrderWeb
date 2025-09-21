import { BsArrowReturnRight } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

const Rating = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto flex flex-col md:flex-row items-stretch gap-6 px-6">
                {/* Bên trái: hình ảnh */}
                <div className="md:w-1/2 flex justify-center items-center px-4 md:px-0 lg:px-6">
                    <img
                        src="/images/disposable-cup-1-1.png"
                        alt="Description"
                        className="w-[324px] h-[440px] object-cover rounded-lg"
                    />
                </div>

                {/* Bên phải: text */}
                <div className="md:w-1/2 flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-row flex-wrap justify-start gap-[10px] h-full p-0">
                            {[...Array(5)].map((_, index) => (
                                <FaStar key={index} className="text-[#C19D56]" />
                            ))}
                        </div>
                        <div className="font-medium uppercase leading-[22px] tracking-[1px] text-[#86624A]">
                            100,000 Five Star Rating
                        </div>
                    </div>

                    <h2 className="text-[#111111] font-[Marcellus] font-normal text-[52px] leading-[62px] tracking-[-1px]">
                        A Cup of Comfort, A World of Flavor
                    </h2>

                    <p className="font-dm-sans mt-2 text-base sm:text-lg md:text-lg lg:text-xl opacity-70 text-gray-700 leading-[1.3]">
                        Sip comfort and explore a world rich, flavorful coffee every cup!
                    </p>

                    <div className="flex gap-3 mt-6">
                        <button className="self-start w-fit border border-transparent rounded-lg bg-[#C19D56] px-6 py-4 hover:bg-[#86624A] hover:border-[#C19D56] transition-colors duration-300">
                            <span className="flex items-center gap-4 text-white">
                                MUSHROOM COFFEE
                                <BsArrowReturnRight />
                            </span>
                        </button>
                        <button className="self-start w-fit border border-[#C19D56] rounded-lg px-6 py-4 hover:bg-[#86624A] hover:border-[#C19D56] transition-colors duration-300">
                            <span className="flex items-center gap-4 text-[#C19D56]">
                                SHOP NOW
                                <BsArrowReturnRight />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Rating