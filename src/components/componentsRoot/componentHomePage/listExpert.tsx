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
    ];

    return (
        // Thêm overflow-hidden ở ngoài cùng để chống tràn thanh cuộn ngang
        <section className="bg-[#1d0e04] w-full py-16 lg:py-24 overflow-hidden">
            {/* Dùng max-w-7xl để khóa độ rộng trên màn hình iMac/PC lớn */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ================= BÊN TRÊN: TEXT & BUTTON ================= */}
                {/* Đổi sang flex-col ở mobile và flex-row ở desktop */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-12">
                    
                    {/* Text Section */}
                    <div className="text-center md:text-left max-w-2xl">
                        <span className="inline-flex items-center justify-center md:justify-start gap-2 font-dm-sans text-[#c19d56] mb-4 text-sm sm:text-base font-bold uppercase tracking-widest">
                            <GiCoffeeCup className="text-xl" />
                            Our Team Experts
                        </span>
                        
                        {/* Typography chia bậc cho Mobile -> Tablet -> Desktop */}
                        <h2 className="text-white font-marcellus text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-tight lg:leading-[62px] tracking-tight">
                            Meet Our Experts <br className="hidden lg:block" /> Behind Your Financial Growth
                        </h2>
                    </div>
                    
                    {/* Button Section */}
                    <button className="w-full sm:w-auto flex-shrink-0 border border-transparent rounded-lg bg-[#C19D56] px-8 py-3.5 hover:bg-[#86624A] transition-all duration-300 shadow-md hover:-translate-y-1 group">
                        <span className="flex items-center justify-center gap-3 text-white font-semibold tracking-wide">
                            VIEW MORE
                            <BsArrowReturnRight className="transition-transform group-hover:translate-x-1" />
                        </span>
                    </button>
                </div>

                <div className="w-full h-[1px] bg-white opacity-20 my-10 lg:my-14"></div>

                {/* ================= BÊN DƯỚI: SCROLL LIST ================= */}
                <div className="relative w-full">
                    {/* Lưu ý: Đảm bảo bạn đã setup 'animate-scroll-step' trong tailwind.config.js nhé */}
                    <div className="flex animate-scroll-step gap-4 sm:gap-6">
                        {items.concat(items).map((item, index) => (
                            <div
                                key={index}
                                /* 👇 TUYỆT CHIÊU ĐÂY: Dùng width theo % tùy breakpoint thay vì Inline Style */
                                className="flex-shrink-0 flex flex-col items-center text-center 
                                           w-[75%] sm:w-[45%] md:w-[30%] lg:w-[28%]"
                            >
                                {/* Ảnh được bọc trong khung vuông (aspect-square) */}
                                <div className="w-full aspect-square relative group overflow-hidden rounded-2xl shadow-xl bg-stone-900">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        // Thêm hiệu ứng hover phóng to nhẹ cho từng chuyên gia
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <span className="mt-5 text-white font-dm-sans font-semibold text-lg sm:text-xl tracking-wide">
                                    {item.title}
                                </span>
                                <span className="text-sm sm:text-base text-[#C19D56] mt-1 font-medium tracking-wider">
                                    {item.subtitle}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

export default ListExpert;