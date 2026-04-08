import { BsArrowReturnRight } from "react-icons/bs";
import { GiCoffeeCup } from "react-icons/gi";
import Image from "next/image";
import Link from "next/link";

const ListExpert = () => {
    // Đã Việt hóa các chức danh
    const items = [
        { img: "/images/Ava.jpg", title: "Ava", subtitle: "Quản Lý" },
        { img: "/images/Emma.jpg", title: "Emma", subtitle: "Quản Lý" },
        { img: "/images/Noah.jpg", title: "Noah", subtitle: "Chuyên Viên" },
        { img: "/images/Olivia.jpg", title: "Olivia", subtitle: "Quản Lý" },
        { img: "/images/Sophie.jpg", title: "Sophie", subtitle: "Chuyên Viên" },
        { img: "/images/Liam.jpg", title: "Liam", subtitle: "Quản Lý" },
    ];

    return (
        <section className="relative w-full py-16 lg:py-24 overflow-hidden bg-[#1d0e04] bg-[url('/images/bg-homepage.png')] bg-cover bg-center bg-no-repeat font-marcellus">
            
            {/* Lớp Overlay đen mờ bảo vệ text, giúp chữ không bị chìm vào nền */}
            <div className="absolute inset-0 bg-black/70 z-0"></div>

            {/* Bọc nội dung trong relative z-10 để nó nổi lên trên lớp overlay */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ================= BÊN TRÊN: TEXT & BUTTON ================= */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-12">
                    
                    {/* Text Section */}
                    <div className="text-center md:text-left max-w-2xl">
                        <span className="inline-flex items-center justify-center md:justify-start gap-2 font-dm-sans text-[#c19d56] mb-4 text-sm sm:text-base font-bold uppercase tracking-widest">
                            <GiCoffeeCup className="text-xl" />
                            Đội Ngũ Chuyên Gia
                        </span>
                        
                        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-tight lg:leading-[62px] tracking-tight">
                            Gặp Gỡ Những Chuyên Gia <br className="hidden lg:block" /> Đứng Sau Hương Vị Của Bạn
                        </h2>
                    </div>
                    
                    {/* Button Section: Đổi button thành Link chuẩn SEO */}
                    <Link href="/experts" className="w-full sm:w-auto flex-shrink-0 border border-transparent rounded-lg bg-[#C19D56] px-8 py-3.5 hover:bg-[#86624A] transition-all duration-300 shadow-md hover:-translate-y-1 group">
                        <span className="flex items-center justify-center gap-3 text-white font-semibold tracking-wide font-dm-sans">
                            XEM THÊM
                            <BsArrowReturnRight className="transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                </div>

                <div className="w-full h-[1px] bg-white opacity-20 my-10 lg:my-14"></div>

                {/* ================= BÊN DƯỚI: SCROLL LIST ================= */}
                <div className="relative w-full">
                    <div className="flex animate-scroll-step gap-4 sm:gap-6">
                        {items.concat(items).map((item, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 flex flex-col items-center text-center 
                                           w-[75%] sm:w-[45%] md:w-[30%] lg:w-[28%]"
                            >
                                <div className="w-full aspect-square relative group overflow-hidden rounded-2xl shadow-xl bg-stone-900">
                                    {/* Chuẩn SEO: Dùng Next Image, thêm alt chứa từ khóa */}
                                    <Image
                                        src={item.img}
                                        alt={`Chân dung chuyên gia pha chế ${item.title}`}
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <span className="mt-5 text-white font-dm-sans font-semibold text-lg sm:text-xl tracking-wide">
                                    {item.title}
                                </span>
                                <span className="text-sm sm:text-base text-[#C19D56] mt-1 font-medium tracking-wider font-dm-sans">
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