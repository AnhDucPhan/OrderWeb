'use client'
import { Slider, Switch, ConfigProvider } from 'antd';
import { useState } from "react";

const BodyShop = () => {
    const [disabled, setDisabled] = useState(false);
    const [sort, setSort] = useState('-createdAt')


    const onChange = (checked: boolean) => {
        setDisabled(checked);
    };

    const handleSortItems = (e: any, page: any) => {
        const newSort = e.target.value;
        setSort(newSort);

        // Cập nhật URL → trigger ProductPage render lại
        // router.push(`?current=${page}&pageSize=${meta.pageSize}&sort=${newSort}`);
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#C19D56', // màu chủ đạo của toàn bộ hệ thống
                },
                components: {
                    Slider: {
                        colorPrimary: '#C19D56',          // màu thanh tiến trình
                        colorPrimaryBorder: '#C19D56',    // viền handle
                        handleColor: '#C19D56',           // màu chấm tròn
                        handleActiveColor: '#C19D56',     // màu khi kéo
                        handleActiveOutlineColor: '#C19D56', // viền khi focus (mặc định xanh, giờ đổi thành vàng)
                        trackBg: '#C19D56',
                        trackHoverBg: '#b1843d',
                    },
                },
            }}
        >
            <div className="flex flex-col lg:flex-row w-full px-6 sm:px-12 lg:px-24 py-12 gap-8 items-stretch">

                {/* Sidebar filter */}
                <div className="w-full lg:basis-1/3 flex flex-col justify-between space-y-8 h-full">
                    <div className="border border-gray-200 rounded-2xl p-6 space-y-6  bg-white">

                        {/* Title */}
                        <h3 className="relative pl-6 text-[#111111] font-[Marcellus] font-normal text-[24px] sm:text-[26px] leading-[30px] tracking-[-1px]
            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
            before:w-[10px] before:h-[10px] before:rounded-full before:bg-[#C19D56]">
                            Filter by price
                        </h3>

                        {/* Slider */}
                        <div className="mt-4">
                            <Slider
                                range
                                defaultValue={[20, 50]}
                                disabled={disabled}
                            />
                        </div>

                        {/* Min / Max input */}
                        <div className="flex justify-between gap-6">
                            {/* Min */}
                            <div className="flex flex-col items-center gap-1">
                                <input
                                    type="number"
                                    className="w-14 sm:w-16 p-0 text-center leading-[30px] min-h-[35px] rounded border-0 bg-[#f5f5f5] font-semibold text-[#111111] appearance-none"
                                    value={20}
                                    readOnly
                                />
                                <label className="text-sm text-gray-400 font-[DM_Sans]">Min. Price</label>
                            </div>

                            {/* Max */}
                            <div className="flex flex-col items-center gap-1">
                                <input
                                    type="number"
                                    className="w-14 sm:w-16 p-0 text-center leading-[30px] min-h-[35px] rounded border-0 bg-[#f5f5f5] font-semibold text-[#111111] appearance-none"
                                    value={50}
                                    readOnly
                                />
                                <label className="text-sm text-gray-400 font-[DM_Sans]">Max. Price</label>
                            </div>
                        </div>
                    </div>
                    <div className="border border-gray-200 rounded-2xl p-6 space-y-6  bg-white">
                        <h3 className="relative pl-6 text-[#111111] font-[Marcellus] font-normal text-[24px] sm:text-[26px] leading-[30px] tracking-[-1px]
            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
            before:w-[10px] before:h-[10px] before:rounded-full before:bg-[#C19D56]">
                            Product Categories
                        </h3>
                        <ul>
                            <li className="py-[5px]">
                                <span className="text-base text-[#262626] font-[DM_Sans] leading-[30px] 
      hover:text-[#C19D56] transition-colors duration-200 cursor-pointer">
                                    Uncategorized
                                </span>
                            </li>

                            <li className="py-[5px]">
                                <span className="text-base text-[#262626] font-[DM_Sans] leading-[30px] 
      hover:text-[#C19D56] transition-colors duration-200 cursor-pointer">
                                    Accessories
                                </span>
                            </li>

                            <li className="py-[5px]">
                                <span className="text-base text-[#262626] font-[DM_Sans] leading-[30px] 
      hover:text-[#C19D56] transition-colors duration-200 cursor-pointer">
                                    Clothing
                                </span>
                            </li>

                            <li className="py-[5px]">
                                <span className="text-base text-[#262626] font-[DM_Sans] leading-[30px] 
      hover:text-[#C19D56] transition-colors duration-200 cursor-pointer">
                                    Hoodies
                                </span>
                            </li>

                            <li className="py-[5px]">
                                <span className="text-base text-[#262626] font-[DM_Sans] leading-[30px] 
      hover:text-[#C19D56] transition-colors duration-200 cursor-pointer">
                                    Music
                                </span>
                            </li>

                            <li className="py-[5px]">
                                <span className="text-base text-[#262626] font-[DM_Sans] leading-[30px] 
      hover:text-[#C19D56] transition-colors duration-200 cursor-pointer">
                                    Tshirts
                                </span>
                            </li>
                        </ul>

                    </div>
                    <div className='border border-gray-200 rounded-2xl p-6 space-y-6  bg-white'>
                        <h3 className="relative pl-6 text-[#111111] font-[Marcellus] font-normal text-[24px] sm:text-[26px] leading-[30px] tracking-[-1px]
            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
            before:w-[10px] before:h-[10px] before:rounded-full before:bg-[#C19D56]">
                            Product Tag
                        </h3>
                        <p className="flex flex-wrap gap-[10px]">
                            <a className="font-medium text-[14px] text-[#797979] bg-[#f6f6f8] 
    px-[14px] py-[10px] border-0 rounded-[6px] tracking-[0.2px]
    hover:bg-[#C19D56] hover:text-[#fff] transition-colors duration-200">
                                Aroma
                            </a>

                            <a className="font-medium text-[14px] text-[#797979] bg-[#f6f6f8] 
    px-[14px] py-[10px] border-0 rounded-[6px] tracking-[0.2px]
    hover:bg-[#C19D56] hover:text-[#fff] transition-colors duration-200">
                                Bean
                            </a>

                            <a className="font-medium text-[14px] text-[#797979] bg-[#f6f6f8] 
    px-[14px] py-[10px] border-0 rounded-[6px] tracking-[0.2px]
    hover:bg-[#C19D56] hover:text-[#fff] transition-colors duration-200">
                                Crema
                            </a>

                            <a className="font-medium text-[14px] text-[#797979] bg-[#f6f6f8] 
    px-[14px] py-[10px] border-0 rounded-[6px] tracking-[0.2px]
    hover:bg-[#C19D56] hover:text-[#fff] transition-colors duration-200">
                                Espresso
                            </a>

                            <a className="font-medium text-[14px] text-[#797979] bg-[#f6f6f8] 
    px-[14px] py-[10px] border-0 rounded-[6px] tracking-[0.2px]
    hover:bg-[#C19D56] hover:text-[#fff] transition-colors duration-200">
                                PerkUp
                            </a>

                            <a className="font-medium text-[14px] text-[#797979] bg-[#f6f6f8] 
    px-[14px] py-[10px] border-0 rounded-[6px] tracking-[0.2px]
    hover:bg-[#C19D56] hover:text-[#fff] transition-colors duration-200">
                                Roast
                            </a>
                        </p>

                    </div>
                    <div className='border border-gray-200 rounded-2xl p-6 space-y-6  bg-white'>
                        <h3 className="relative pl-6 text-[#111111] font-[Marcellus] font-normal text-[24px] sm:text-[26px] leading-[30px] tracking-[-1px]
            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
            before:w-[10px] before:h-[10px] before:rounded-full before:bg-[#C19D56]">
                            Products
                        </h3>
                        <ul className="space-y-3 sm:space-y-4 md:space-y-5">
                            <li>
                                <a className="text-base font-bold text-[#262626] font-[DM_Sans] leading-[30px] 
      hover:text-[#C19D56] transition-colors duration-200">
                                    Dispensing Tray
                                </a>
                                <div className="flex gap-2">
                                    <del className="text-[#797979]">£240.00</del>
                                    <ins className="text-[#797979]">£230.00</ins>
                                </div>
                            </li>

                            <li>
                                <a className="text-base font-bold text-[#262626] font-[DM_Sans] leading-[30px] 
      hover:text-[#C19D56] transition-colors duration-200">
                                    Coffee Capsule
                                </a>
                                <div className="flex gap-2">
                                    <del className="text-[#797979]">£240.00</del>
                                    <ins className="text-[#797979]">£230.00</ins>
                                </div>
                            </li>

                            <li>
                                <a className="text-base font-bold text-[#262626] font-[DM_Sans] leading-[30px] 
      hover:text-[#C19D56] transition-colors duration-200">
                                    Dolce Gusto
                                </a>
                                <div className="flex gap-2">
                                    <del className="text-[#797979]">£240.00</del>
                                    <ins className="text-[#797979]">£230.00</ins>
                                </div>
                            </li>

                            <li>
                                <a className="text-base font-bold text-[#262626] font-[DM_Sans] leading-[30px] 
      hover:text-[#C19D56] transition-colors duration-200">
                                    Measuring Cup
                                </a>
                                <div className="flex gap-2">
                                    <del className="text-[#797979]">£240.00</del>
                                    <ins className="text-[#797979]">£230.00</ins>
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>

                {/* Main content */}
                <div className="w-full lg:basis-2/3 bg-white p-6 h-full flex flex-col justify-between">
                    {/* Header: Showing + Select */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 py-4">
                        {/* Left text */}
                        <p className="text-sm sm:text-base text-[#797979] font-[DM_Sans] text-center sm:text-left">
                            Showing <span className="text-[#111111] font-medium">1–9</span> of{" "}
                            <span className="text-[#111111] font-medium">18</span> results
                        </p>

                        {/* Right select */}
                        <form className="w-full sm:w-auto flex justify-center sm:justify-end">
                            <select
                                className="w-full sm:w-auto text-sm sm:text-base text-[#111111] font-[DM_Sans] border border-gray-300 rounded-md px-3 py-2 h-[40px] outline-none bg-white transition "
                                defaultValue="createdAt"
                            >
                                <option value="createdAt">Default sorting</option>
                                <option value="basePrice">Sort by popularity</option>
                                <option value="-basePrice">Sort by average rating</option>
                                <option value="-createdAt">Sort by latest</option>
                                <option value="priceLow">Sort by price: low to high</option>
                                <option value="priceHigh">Sort by price: high to low</option>
                            </select>
                        </form>
                    </div>

                    {/* Product grid */}
                    <div className='mt-10'>
                        <ul className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-11">
                            <li className="relative border border-gray-200 p-6 flex flex-col gap-2 items-center rounded-lg group overflow-hidden transition hover:shadow-lg">
                                <a className="flex flex-col gap-2 items-center">
                                    <img
                                        src="/images/black-coffee.png"
                                        alt="Black Coffee"
                                        width={200}
                                        height={200}
                                        className="object-cover w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
                                    />
                                    <h2 className="text-base sm:text-lg font-[DM_Sans] font-semibold text-[#262626] group-hover:text-[#C19D56] transition">
                                        Black Coffee
                                    </h2>
                                </a>

                                {/* Prices */}
                                <span className="prices-product flex gap-2 text-sm sm:text-base font-[DM_Sans]">
                                    <del className="opacity-40">£15.00</del>
                                    <ins className="no-underline text-[#C19D56]">£12.00</ins>
                                </span>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300">
                                    <button className="bg-white text-black px-4 py-2 rounded shadow hover:bg-[#C19D56] hover:text-white transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </li>
                            <li className="relative border border-gray-200 p-6 flex flex-col gap-2 items-center rounded-lg group overflow-hidden transition hover:shadow-lg">
                                <a className="flex flex-col gap-2 items-center">
                                    <img
                                        src="/images/black-coffee.png"
                                        alt="Black Coffee"
                                        width={200}
                                        height={200}
                                        className="object-cover w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
                                    />
                                    <h2 className="text-base sm:text-lg font-[DM_Sans] font-semibold text-[#262626] group-hover:text-[#C19D56] transition">
                                        Black Coffee
                                    </h2>
                                </a>

                                {/* Prices */}
                                <span className="prices-product flex gap-2 text-sm sm:text-base font-[DM_Sans]">
                                    <del className="opacity-40">£15.00</del>
                                    <ins className="no-underline text-[#C19D56]">£12.00</ins>
                                </span>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300">
                                    <button className="bg-white text-black px-4 py-2 rounded shadow hover:bg-[#C19D56] hover:text-white transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </li>
                            <li className="relative border border-gray-200 p-6 flex flex-col gap-2 items-center rounded-lg group overflow-hidden transition hover:shadow-lg">
                                <a className="flex flex-col gap-2 items-center">
                                    <img
                                        src="/images/black-coffee.png"
                                        alt="Black Coffee"
                                        width={200}
                                        height={200}
                                        className="object-cover w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
                                    />
                                    <h2 className="text-base sm:text-lg font-[DM_Sans] font-semibold text-[#262626] group-hover:text-[#C19D56] transition">
                                        Black Coffee
                                    </h2>
                                </a>

                                {/* Prices */}
                                <span className="prices-product flex gap-2 text-sm sm:text-base font-[DM_Sans]">
                                    <del className="opacity-40">£15.00</del>
                                    <ins className="no-underline text-[#C19D56]">£12.00</ins>
                                </span>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300">
                                    <button className="bg-white text-black px-4 py-2 rounded shadow hover:bg-[#C19D56] hover:text-white transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </li>
                            <li className="relative border border-gray-200 p-6 flex flex-col gap-2 items-center rounded-lg group overflow-hidden transition hover:shadow-lg">
                                <a className="flex flex-col gap-2 items-center">
                                    <img
                                        src="/images/black-coffee.png"
                                        alt="Black Coffee"
                                        width={200}
                                        height={200}
                                        className="object-cover w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
                                    />
                                    <h2 className="text-base sm:text-lg font-[DM_Sans] font-semibold text-[#262626] group-hover:text-[#C19D56] transition">
                                        Black Coffee
                                    </h2>
                                </a>

                                {/* Prices */}
                                <span className="prices-product flex gap-2 text-sm sm:text-base font-[DM_Sans]">
                                    <del className="opacity-40">£15.00</del>
                                    <ins className="no-underline text-[#C19D56]">£12.00</ins>
                                </span>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300">
                                    <button className="bg-white text-black px-4 py-2 rounded shadow hover:bg-[#C19D56] hover:text-white transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </li>
                            <li className="relative border border-gray-200 p-6 flex flex-col gap-2 items-center rounded-lg group overflow-hidden transition hover:shadow-lg">
                                <a className="flex flex-col gap-2 items-center">
                                    <img
                                        src="/images/black-coffee.png"
                                        alt="Black Coffee"
                                        width={200}
                                        height={200}
                                        className="object-cover w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
                                    />
                                    <h2 className="text-base sm:text-lg font-[DM_Sans] font-semibold text-[#262626] group-hover:text-[#C19D56] transition">
                                        Black Coffee
                                    </h2>
                                </a>

                                {/* Prices */}
                                <span className="prices-product flex gap-2 text-sm sm:text-base font-[DM_Sans]">
                                    <del className="opacity-40">£15.00</del>
                                    <ins className="no-underline text-[#C19D56]">£12.00</ins>
                                </span>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300">
                                    <button className="bg-white text-black px-4 py-2 rounded shadow hover:bg-[#C19D56] hover:text-white transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </li>
                            <li className="relative border border-gray-200 p-6 flex flex-col gap-2 items-center rounded-lg group overflow-hidden transition hover:shadow-lg">
                                <a className="flex flex-col gap-2 items-center">
                                    <img
                                        src="/images/black-coffee.png"
                                        alt="Black Coffee"
                                        width={200}
                                        height={200}
                                        className="object-cover w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
                                    />
                                    <h2 className="text-base sm:text-lg font-[DM_Sans] font-semibold text-[#262626] group-hover:text-[#C19D56] transition">
                                        Black Coffee
                                    </h2>
                                </a>

                                {/* Prices */}
                                <span className="prices-product flex gap-2 text-sm sm:text-base font-[DM_Sans]">
                                    <del className="opacity-40">£15.00</del>
                                    <ins className="no-underline text-[#C19D56]">£12.00</ins>
                                </span>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300">
                                    <button className="bg-white text-black px-4 py-2 rounded shadow hover:bg-[#C19D56] hover:text-white transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </li>
                            <li className="relative border border-gray-200 p-6 flex flex-col gap-2 items-center rounded-lg group overflow-hidden transition hover:shadow-lg">
                                <a className="flex flex-col gap-2 items-center">
                                    <img
                                        src="/images/black-coffee.png"
                                        alt="Black Coffee"
                                        width={200}
                                        height={200}
                                        className="object-cover w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
                                    />
                                    <h2 className="text-base sm:text-lg font-[DM_Sans] font-semibold text-[#262626] group-hover:text-[#C19D56] transition">
                                        Black Coffee
                                    </h2>
                                </a>

                                {/* Prices */}
                                <span className="prices-product flex gap-2 text-sm sm:text-base font-[DM_Sans]">
                                    <del className="opacity-40">£15.00</del>
                                    <ins className="no-underline text-[#C19D56]">£12.00</ins>
                                </span>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300">
                                    <button className="bg-white text-black px-4 py-2 rounded shadow hover:bg-[#C19D56] hover:text-white transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </li>
                            <li className="relative border border-gray-200 p-6 flex flex-col gap-2 items-center rounded-lg group overflow-hidden transition hover:shadow-lg">
                                <a className="flex flex-col gap-2 items-center">
                                    <img
                                        src="/images/black-coffee.png"
                                        alt="Black Coffee"
                                        width={200}
                                        height={200}
                                        className="object-cover w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
                                    />
                                    <h2 className="text-base sm:text-lg font-[DM_Sans] font-semibold text-[#262626] group-hover:text-[#C19D56] transition">
                                        Black Coffee
                                    </h2>
                                </a>

                                {/* Prices */}
                                <span className="prices-product flex gap-2 text-sm sm:text-base font-[DM_Sans]">
                                    <del className="opacity-40">£15.00</del>
                                    <ins className="no-underline text-[#C19D56]">£12.00</ins>
                                </span>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300">
                                    <button className="bg-white text-black px-4 py-2 rounded shadow hover:bg-[#C19D56] hover:text-white transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </li>
                            <li className="relative border border-gray-200 p-6 flex flex-col gap-2 items-center rounded-lg group overflow-hidden transition hover:shadow-lg">
                                <a className="flex flex-col gap-2 items-center">
                                    <img
                                        src="/images/black-coffee.png"
                                        alt="Black Coffee"
                                        width={200}
                                        height={200}
                                        className="object-cover w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
                                    />
                                    <h2 className="text-base sm:text-lg font-[DM_Sans] font-semibold text-[#262626] group-hover:text-[#C19D56] transition">
                                        Black Coffee
                                    </h2>
                                </a>

                                {/* Prices */}
                                <span className="prices-product flex gap-2 text-sm sm:text-base font-[DM_Sans]">
                                    <del className="opacity-40">£15.00</del>
                                    <ins className="no-underline text-[#C19D56]">£12.00</ins>
                                </span>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300">
                                    <button className="bg-white text-black px-4 py-2 rounded shadow hover:bg-[#C19D56] hover:text-white transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

        </ConfigProvider>
    );
}

export default BodyShop;
