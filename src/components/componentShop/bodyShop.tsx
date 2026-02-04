'use client'
import { addToCartAPI } from '@/lib/features/cartSlice';
import { AppDispatch } from '@/lib/store';
import { Slider, Switch, ConfigProvider, message } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';

interface Product {
    id: number;
    name: string;
    price: number;
    thumbnail: string;
}

interface Meta {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
}

const BodyShop = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [disabled, setDisabled] = useState(false);
    const [sort, setSort] = useState('-createdAt')
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('createdAt');

    const fetchProducts = async (page = 1, currentSort = sortBy) => { // Nhận thêm tham số currentSort
        try {
            setLoading(true);

            // 👇 LOGIC MAPPING: Chuyển đổi từ value của Select sang params của API
            let orderBy = 'createdAt';
            let sort = 'desc';

            switch (currentSort) {
                case 'createdAt': // Default sorting (Cũ nhất)
                    orderBy = 'createdAt';
                    sort = 'asc';
                    break;
                case '-createdAt': // Latest (Mới nhất)
                    orderBy = 'createdAt';
                    sort = 'desc';
                    break;
                case 'priceLow': // Giá thấp -> cao
                    orderBy = 'price';
                    sort = 'asc';
                    break;
                case 'priceHigh': // Giá cao -> thấp
                    orderBy = 'price';
                    sort = 'desc';
                    break;
                default:
                    break;
            }

            // Gọi API với các tham số đã map
            const res = await fetch(
                `http://localhost:8386/products?page=${page}&items_per_page=9&orderBy=${orderBy}&sort=${sort}`
            );

            const data = await res.json();
            setProducts(data.data || []);
            setMeta(data.meta);
        } catch (error) {
            console.error('Lỗi gọi API:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSortBy(value);     // Cập nhật State để UI hiển thị đúng
        fetchProducts(1, value); // Gọi API ngay lập tức (Reset về trang 1)
    };

    const handleAddToCart = (product: Product) => {

        dispatch(addToCartAPI({
            productId: product.id,
            quantity: 1,
        }))
            .unwrap() // Giúp bắt lỗi dễ hơn
            .then(() => {
                message.success(`Đã thêm ${product.name} vào giỏ!`);
            })
            .catch(() => {
                message.error('Thêm thất bại!');
            });
    };

    // Gọi API lần đầu khi vào trang
    useEffect(() => {
        fetchProducts(1);
    }, [sort]);


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

            <div className='bg-[#fcfcfc] min-h-screen py-10 sm:py-16'>
                <div className="container mx-auto px-4 sm:px-6 lg:px-24 mb-10 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-[Marcellus] text-[#111111] mb-2">Shopping Now</h1>
                    <p className="text-gray-500 font-[DM_Sans]">
                        <Link href="/" className="hover:text-[#C19D56]">Home</Link> / Shop
                    </p>
                </div>
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
                            {(() => {
                                if (!products || products.length === 0)
                                    return <p>Showing 0-0 of 0 results</p>;

                                const from = meta ? (meta.currentPage - 1) * meta.perPage + 1 : 0;

                                const to = from + products.length - 1;

                                return (
                                    <p className="text-sm sm:text-base text-[#797979] font-[DM_Sans] text-center sm:text-left">
                                        Showing <span className="text-[#111111] font-medium">{from}–{to}</span> of{" "}
                                        <span className="text-[#111111] font-medium">{meta?.total || 0}</span> results
                                    </p>
                                );
                            })()}
                            {/* Right select */}
                            <form className="w-full sm:w-auto flex justify-center sm:justify-end">
                                <select
                                    className="w-full sm:w-auto text-sm sm:text-base text-[#111111] font-[DM_Sans] border border-gray-300 rounded-md px-3 py-2 h-[40px] outline-none bg-white transition cursor-pointer"
                                    defaultValue="createdAt"
                                    value={sortBy}
                                    onChange={handleSortChange}
                                >
                                    <option value="createdAt">Default sorting</option>
                                    <option value="-createdAt">Sort by latest</option>
                                    <option value="priceLow">Sort by price: low to high</option>
                                    <option value="priceHigh">Sort by price: high to low</option>
                                </select>
                            </form>
                        </div>

                        {/* Content List */}
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <p className="text-gray-500">Đang tải dữ liệu...</p>
                            </div>
                        ) : (
                            // 👇 SỬA LẠI: Thêm Grid để chia cột và đổi thành thẻ ul
                            <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {Array.isArray(products) && products?.length > 0 ? (
                                    products.map((product) => (
                                        <li
                                            key={product.id} // 👈 QUAN TRỌNG: Phải có key
                                            className="relative border border-gray-200 p-6 flex flex-col gap-2 items-center rounded-lg group overflow-hidden transition hover:shadow-lg hover:border-[#C19D56]"
                                        >
                                            <a href="#" className="flex flex-col gap-2 items-center w-full">
                                                {/* Ảnh sản phẩm */}
                                                <div className="relative group w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] overflow-hidden rounded-md">
                                                    <img
                                                        src={product.thumbnail || "/images/placeholder.png"}
                                                        alt={product.name}
                                                        width={200}
                                                        height={200}
                                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                                    />

                                                    {/* 2. Lớp phủ Add to Cart */}
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <button
                                                            className="bg-white text-[#C19D56] hover:bg-[#C19D56] hover:text-white font-bold py-2 px-4 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                                                            onClick={(e) => {
                                                                e.preventDefault(); // Chặn click vào link cha (nếu có)
                                                                handleAddToCart(product);
                                                                console.log("Add to cart:", product.id);
                                                            }}
                                                        >

                                                            Add to cart
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Tên sản phẩm */}
                                                <h2 className="text-base sm:text-lg font-[DM_Sans] font-semibold text-[#262626] group-hover:text-[#C19D56] transition text-center line-clamp-2">
                                                    {product.name}
                                                </h2>

                                                {/* Giá tiền (Thêm vào cho đầy đủ) */}
                                                <p className="text-[#C19D56] font-bold">
                                                    {Number(product.price).toLocaleString('vi-VN')} đ
                                                </p>
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-500">
                                        Không tìm thấy sản phẩm nào.
                                    </p>
                                )}
                            </ul>
                        )}
                        {/* Pagination Section */}
                        {meta && meta.lastPage > 1 && (
                            <nav className="flex justify-center mt-12">
                                <ul className="flex gap-2 items-center">

                                    {/* 1. Nút Previous (Trang trước) */}
                                    <li>
                                        <button
                                            disabled={meta.currentPage === 1}
                                            onClick={() => fetchProducts(meta.currentPage - 1)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 transition-colors duration-200
                    ${meta.currentPage === 1
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-[#111111] hover:bg-[#C19D56] hover:text-white hover:border-[#C19D56]'
                                                }`}
                                        >
                                            &#8592; {/* Mũi tên trái */}
                                        </button>
                                    </li>

                                    {/* 2. Danh sách số trang */}
                                    {/* Tạo mảng từ 1 đến lastPage. Ví dụ lastPage = 3 -> [1, 2, 3] */}
                                    {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((pageNumber) => (
                                        <li key={pageNumber}>
                                            <button
                                                onClick={() => fetchProducts(pageNumber)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-md border transition-colors duration-200 font-[DM_Sans] font-medium
                        ${Number(pageNumber) === Number(meta.currentPage)
                                                        ? 'bg-[#111111] !text-white border-[#111111]' // Style trang hiện tại
                                                        : 'text-[#111111] border-gray-200 hover:bg-[#C19D56] hover:text-white hover:border-[#C19D56]' // Style trang thường
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        </li>
                                    ))}

                                    {/* 3. Nút Next (Trang sau) */}
                                    <li>
                                        <button
                                            disabled={meta.currentPage === meta.lastPage}
                                            onClick={() => fetchProducts(meta.currentPage + 1)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 transition-colors duration-200
                    ${meta.currentPage === meta.lastPage
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-[#111111] hover:bg-[#C19D56] hover:text-white hover:border-[#C19D56]'
                                                }`}
                                        >
                                            &#8594; {/* Mũi tên phải */}
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>

                </div>
            </div>

        </ConfigProvider>
    );
}

export default BodyShop;
