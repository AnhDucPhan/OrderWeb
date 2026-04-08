import { FaCheck } from "react-icons/fa6";
import { GiCoffeeCup } from "react-icons/gi";
import Image from "next/image";

const WhyChooseUs = () => {
    // Đã Việt hóa và sửa 2 item bị trùng lặp ở cuối cho đa dạng
    const features = [
        "Tinh Thần Minh Mẫn",
        "Bùng Nổ Năng Lượng",
        "Công Thức Chuẩn Khoa Học",
        "Tập Trung Tối Đa",
        "Hương Vị Đậm Đà"
    ];

    return (
        <section className="bg-[#FCF8F4] w-full min-h-screen py-16 lg:py-24 overflow-hidden font-marcellus">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

                {/* ================= BÊN TRÁI: TEXT ================= */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left relative z-10">
                    <span className="inline-flex justify-center lg:justify-start items-center gap-2 text-[#C19D56] text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase">
                        <GiCoffeeCup className="text-xl" />
                        Vì Sao Chọn Chúng Tôi
                    </span>

                    <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl text-black leading-[1.1] tracking-[-1px]">
                        Chắt Lọc Tinh Hoa, <br className="hidden lg:block" /> Trọn Vị Từng Ly
                    </h2>

                    <p className="font-dm-sans mt-5 sm:mt-6 text-base sm:text-lg text-gray-700 opacity-80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Tại quán cà phê của chúng tôi, mỗi tách cà phê là một câu chuyện. Từ khâu tuyển chọn kỹ lưỡng những hạt cà phê hảo hạng nhất đến nghệ thuật pha chế tinh tế, chúng tôi tận tâm mang đến những khoảnh khắc ấm áp, thư giãn và gắn kết.
                    </p>

                    <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
                        {features.map((item, index) => (
                            <div key={index} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#C19D56] text-lg">
                                    <FaCheck />
                                </div>
                                {/* Chuẩn hóa SEO: Đổi h5 thành h3 để đúng cấu trúc từ h2 xuống */}
                                <h3 className="font-dm-sans font-semibold text-base sm:text-lg text-gray-900 leading-tight">
                                    {item}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= BÊN PHẢI: HÌNH ẢNH ================= */}
                <div className="basis-1/2 flex flex-col items-center mt-12 md:mt-0 w-full relative z-0">

                    {/* Ảnh trên cùng (Ly cà phê) */}
                    <Image
                        src="/images/cof.png"
                        alt="Ly cà phê nguyên chất thượng hạng" // Từ khóa SEO
                        width={400}
                        height={400}
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
                        <Image
                            src="/images/Coffee-Bean.png"
                            alt="Hạt cà phê tươi rang mộc" // Từ khóa SEO
                            width={150}
                            height={150}
                            className="
                            w-[70px] sm:w-[100px] lg:w-[130px] 
                            object-contain h-full spin-slow opacity-25
                        "
                        />

                        {/* Coffee Bag */}
                        <Image
                            src="/images/coff-Photoroom.png"
                            alt="Túi bao bì đóng gói cà phê cao cấp" // Từ khóa SEO
                            width={420}
                            height={500}
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

export default WhyChooseUs;