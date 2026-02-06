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
                token: { colorPrimary: '#C19D56' },
                components: {
                    Slider: {
                        colorPrimary: '#C19D56',
                        colorPrimaryBorder: '#C19D56',
                        handleColor: '#C19D56',
                        handleActiveColor: '#C19D56',
                        handleActiveOutlineColor: '#C19D56',
                        trackBg: '#C19D56',
                        trackHoverBg: '#b1843d',
                    },
                },
            }}
        >
            <div className='bg-[#fcfcfc] min-h-screen py-8 sm:py-12'>
                {/* CONTAINER CHÍNH: Giới hạn chiều rộng tối đa 1350px để không bị loãng trên màn to */}
                <div className="w-full max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb Section */}
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-3xl md:text-4xl font-[Marcellus] text-[#111111] mb-2">Shopping Now</h1>
                        <p className="text-gray-500 font-[DM_Sans] text-sm md:text-base">
                            <Link href="/" className="hover:text-[#C19D56] transition-colors">Home</Link> / Shop
                        </p>
                    </div>

                    {/* Layout Flex: Sidebar trái - Content phải */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start relative">

                        {/* --- SIDEBAR FILTER --- */}
                        {/* Desktop: Chiếm 25% (w-1/4). Mobile: Chiếm 100% */}
                        {/* sticky: Giúp thanh filter trôi theo khi cuộn trên desktop */}
                        <div className="w-full lg:w-1/4 flex-shrink-0 space-y-6 lg:sticky lg:top-4">

                            {/* Filter by Price */}
                            <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                                <h3 className="relative pl-5 text-[#111111] font-[Marcellus] text-xl sm:text-2xl mb-4
                            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
                            before:w-[8px] before:h-[8px] before:rounded-full before:bg-[#C19D56]">
                                    Filter by price
                                </h3>

                                <div className="mt-2 px-1">
                                    <Slider
                                        range
                                        defaultValue={[20, 50]}
                                        disabled={disabled}
                                    />
                                </div>

                                <div className="flex justify-between gap-3 mt-4">
                                    <div className="flex flex-col items-center gap-1 w-full">
                                        <input
                                            type="number"
                                            className="w-full py-1 text-center text-sm rounded border-0 bg-[#f5f5f5] font-semibold text-[#111111] outline-none"
                                            value={20} readOnly
                                        />
                                        <label className="text-xs text-gray-400 font-[DM_Sans]">Min</label>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 w-full">
                                        <input
                                            type="number"
                                            className="w-full py-1 text-center text-sm rounded border-0 bg-[#f5f5f5] font-semibold text-[#111111] outline-none"
                                            value={50} readOnly
                                        />
                                        <label className="text-xs text-gray-400 font-[DM_Sans]">Max</label>
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                                <h3 className="relative pl-5 text-[#111111] font-[Marcellus] text-xl sm:text-2xl mb-4
                            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
                            before:w-[8px] before:h-[8px] before:rounded-full before:bg-[#C19D56]">
                                    Categories
                                </h3>
                                <ul className="space-y-1">
                                    {['Uncategorized', 'Accessories', 'Clothing', 'Hoodies', 'Music', 'Tshirts'].map((item) => (
                                        <li key={item} className="py-1">
                                            <span className="text-sm sm:text-base text-[#555] font-[DM_Sans] hover:text-[#C19D56] transition-colors cursor-pointer block">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Product Tags */}
                            <div className='border border-gray-200 rounded-2xl p-5 bg-white shadow-sm'>
                                <h3 className="relative pl-5 text-[#111111] font-[Marcellus] text-xl sm:text-2xl mb-4
                            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
                            before:w-[8px] before:h-[8px] before:rounded-full before:bg-[#C19D56]">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Aroma', 'Bean', 'Crema', 'Espresso', 'PerkUp', 'Roast'].map((tag) => (
                                        <a key={tag} className="font-medium text-xs sm:text-sm text-[#797979] bg-[#f6f6f8] 
                                    px-3 py-2 rounded-md hover:bg-[#C19D56] hover:text-[#fff] transition-colors cursor-pointer">
                                            {tag}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Products List (Ẩn bớt trên mobile cho gọn nếu muốn, ở đây tui giữ nguyên nhưng chỉnh padding) */}
                            <div className='border border-gray-200 rounded-2xl p-5 bg-white shadow-sm'>
                                <h3 className="relative pl-5 text-[#111111] font-[Marcellus] text-xl sm:text-2xl mb-4
                            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
                            before:w-[8px] before:h-[8px] before:rounded-full before:bg-[#C19D56]">
                                    Best Sellers
                                </h3>
                                <ul className="space-y-4">
                                    {['Dispensing Tray', 'Coffee Capsule', 'Dolce Gusto', 'Measuring Cup'].map((item) => (
                                        <li key={item}>
                                            <a className="text-sm sm:text-base font-bold text-[#262626] font-[DM_Sans] hover:text-[#C19D56] transition-colors block">
                                                {item}
                                            </a>
                                            <div className="flex gap-2 text-xs sm:text-sm mt-1">
                                                <del className="text-[#797979]">£240.00</del>
                                                <ins className="text-[#C19D56] no-underline font-semibold">£230.00</ins>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* --- MAIN CONTENT --- */}
                        {/* Desktop: Chiếm 75% (w-3/4). Flex-col để chứa Toolbar + Grid + Pagination */}
                        <div className="w-full lg:w-3/4 flex flex-col">

                            {/* Toolbar: Showing + Select */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-b border-gray-100 mb-6">
                                {(() => {
                                    if (!products || products.length === 0) return <p className="text-sm text-gray-500">No products found</p>;
                                    const from = meta ? (meta.currentPage - 1) * meta.perPage + 1 : 0;
                                    const to = from + products.length - 1;
                                    return (
                                        <p className="text-sm text-[#797979] font-[DM_Sans]">
                                            Showing <span className="text-[#111] font-medium">{from}–{to}</span> of <span className="text-[#111] font-medium">{meta?.total || 0}</span> results
                                        </p>
                                    );
                                })()}

                                <form className="w-full sm:w-auto">
                                    <select
                                        className="w-full sm:w-auto text-sm border border-gray-200 rounded px-3 py-2 outline-none bg-white cursor-pointer hover:border-[#C19D56] focus:border-[#C19D56] transition-colors"
                                        defaultValue="createdAt"
                                        value={sortBy}
                                        onChange={handleSortChange}
                                    >
                                        <option value="createdAt">Default sorting</option>
                                        <option value="-createdAt">Sort by latest</option>
                                        <option value="priceLow">Price: Low to High</option>
                                        <option value="priceHigh">Price: High to Low</option>
                                    </select>
                                </form>
                            </div>

                            {/* Content Grid */}
                            {loading ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                                </div>
                            ) : (
                                // RESPONSIVE GRID:
                                // Mobile: 2 cột (grid-cols-2) - Đỡ phải cuộn nhiều
                                // Tablet: 3 cột (md:grid-cols-3)
                                // Desktop lớn: 3 cột hoặc 4 cột tùy thích (ở đây để 3 cho ảnh to đẹp)
                                <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                                    {Array.isArray(products) && products?.length > 0 ? (
                                        products.map((product) => (
                                            <li
                                                key={product.id}
                                                className="group relative flex flex-col gap-3"
                                            >
                                                <a href="#" className="block w-full">
                                                    {/* Ảnh vuông (Aspect Square) - Giúp ảnh đều nhau 100% */}
                                                    <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-[#f9f9f9] border border-gray-100 group-hover:border-[#C19D56]/50 transition-colors">
                                                        <img
                                                            src={product.thumbnail || "/images/placeholder.png"}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />

                                                        {/* Nút Add to Cart: Hiện lên khi hover */}
                                                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex justify-center">
                                                            <button
                                                                className="bg-white text-[#111] hover:bg-[#C19D56] hover:text-white font-bold py-2 px-4 rounded shadow-lg text-xs sm:text-sm whitespace-nowrap"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleAddToCart(product);
                                                                }}
                                                            >
                                                                Add to cart
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Thông tin sản phẩm */}
                                                    <div className="mt-3 text-center px-1">
                                                        <h2 className="text-sm sm:text-base font-[DM_Sans] font-bold text-[#262626] group-hover:text-[#C19D56] transition line-clamp-2 h-[40px] sm:h-[48px] leading-tight">
                                                            {product.name}
                                                        </h2>
                                                        <p className="text-[#C19D56] font-bold mt-1 text-sm sm:text-base">
                                                            {Number(product.price).toLocaleString('vi-VN')} đ
                                                        </p>
                                                    </div>
                                                </a>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="col-span-full text-center text-gray-500 py-10">
                                            Không tìm thấy sản phẩm nào.
                                        </p>
                                    )}
                                </ul>
                            )}

                            {/* Pagination Section */}
                            {meta && meta.lastPage > 1 && (
                                <nav className="flex justify-center mt-12">
                                    <ul className="flex gap-2 items-center">
                                        {/* Prev */}
                                        <li>
                                            <button
                                                disabled={meta.currentPage === 1}
                                                onClick={() => fetchProducts(meta.currentPage - 1)}
                                                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded border border-gray-200 transition-colors
                                            ${meta.currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#111] hover:bg-[#C19D56] hover:text-white hover:border-[#C19D56]'}`}
                                            >
                                                &#8592;
                                            </button>
                                        </li>
                                        {/* Pages */}
                                        {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((pageNumber) => (
                                            <li key={pageNumber}>
                                                <button
                                                    onClick={() => fetchProducts(pageNumber)}
                                                    className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded border transition-colors font-medium text-sm
                                                ${Number(pageNumber) === Number(meta.currentPage)
                                                            ? 'bg-[#111] !text-white border-[#111]'
                                                            : 'text-[#111] border-gray-200 hover:bg-[#C19D56] hover:text-white hover:border-[#C19D56]'}`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            </li>
                                        ))}
                                        {/* Next */}
                                        <li>
                                            <button
                                                disabled={meta.currentPage === meta.lastPage}
                                                onClick={() => fetchProducts(meta.currentPage + 1)}
                                                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded border border-gray-200 transition-colors
                                            ${meta.currentPage === meta.lastPage ? 'text-gray-300 cursor-not-allowed' : 'text-[#111] hover:bg-[#C19D56] hover:text-white hover:border-[#C19D56]'}`}
                                            >
                                                &#8594;
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
}

export default BodyShop;
