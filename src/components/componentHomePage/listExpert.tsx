import { BsArrowReturnRight } from "react-icons/bs";
import { GiCoffeeCup } from "react-icons/gi";

const ListExpert = () => {
    const items = [
        { img: "/images/Ava.jpg", title: "Ava", subtitle: "Manager" },
        { img: "/images/Emma.jpg", title: "Emma", subtitle: "Manager" },
        { img: "/images/Noah.jpg", title: "Noah", subtitle: "Agent" },
        { img: "/images/Olivia.jpg", title: "Olivia", subtitle: "Manager" },
        { img: "/images/Sophie.jpg", title: "Sophie", subtitle: "Agent" },
        { img: "/images/Liam.jpg", title: "Liam", subtitle: "Manager" },
        // thêm item khác
    ];
    return (
        <section className="">
            <div className="bg-[#1d0e04]  w-full py-12 px-6 sm:px-10 lg:px-20  ">
                {/* Text trên cùng */}
                <div className="flex justify-between items-center">
                    <div className="text-center md:text-left max-w-4xl mx-auto md:mx-0 mb-12">
                        <span className="inline-flex gap-2 items-center font-dm-sans text-[#c19d56] mb-[14px] text-base font-normal uppercase leading-[1.4] tracking-[2px]">
                            <GiCoffeeCup />
                            Our Team Experts
                        </span>
                        <h2 className="text-white font-[Marcellus] font-normal text-[52px] leading-[62px] tracking-[-1px]">
                            Meet the Our Experts Behind Your Financial Growth
                        </h2>
                    </div>
                    <button className="w-fit border border-transparent rounded-lg bg-[#C19D56] px-6 py-4 hover:bg-[#86624A] hover:border-[#C19D56] transition-colors duration-300">
                        <span className="flex items-center gap-4 text-white">
                            VIEW MORE
                            <BsArrowReturnRight />
                        </span>
                    </button>
                </div>

                <div className="w-full h-[1px] bg-white opacity-20 my-10"></div>


                {/* List scroll tự động */}
                <div className="overflow-hidden relative w-full">
                    <div className="flex animate-scroll-step gap-4">
                        {items.concat(items).map((item, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 flex flex-col items-center text-center"
                                style={{ width: '28.57%' }} // 3.5 item vừa màn hình
                            >
                                <div className="w-full aspect-square">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-cover rounded-2xl shadow-lg"
                                    />
                                </div>
                                <span className="mt-4 text-white font-dm-sans font-semibold text-gray-900 text-lg">
                                    {item.title}
                                </span>
                                <span className="text-sm text-[#C19D56] ">{item.subtitle}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>


    )
}

export default ListExpert