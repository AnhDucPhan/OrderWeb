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
            <div className='bg-[#fcfcfc] min-h-screen py-8 sm:py-16'>
                {/* Breadcrumb Section */}
                <div className="container mx-auto px-4 md:px-8 lg:px-12 mb-8 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-[Marcellus] text-[#111111] mb-2">Shopping Now</h1>
                    <p className="text-gray-500 font-[DM_Sans] text-sm sm:text-base">
                        <Link href="/" className="hover:text-[#C19D56] transition-colors">Home</Link> / Shop
                    </p>
                </div>

                <div className="container mx-auto px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row gap-8 items-start relative">

                    {/* --- SIDEBAR FILTER --- */}
                    {/* Thêm lg:sticky để thanh filter trôi theo khi scroll trên desktop */}
                    <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 z-10 space-y-6">

                        {/* TRICK: Dùng details/summary để thu gọn filter trên Mobile, mở sẵn trên Desktop (bằng css hoặc logic check width) */}
                        {/* Ở đây mình làm giao diện mobile hiển thị nút "Show Filter" */}
                        <div className="lg:block">
                            <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                                <h3 className="relative pl-6 text-[#111111] font-[Marcellus] text-xl sm:text-2xl mb-6
                            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
                            before:w-[8px] before:h-[8px] before:rounded-full before:bg-[#C19D56]">
                                    Filter by price
                                </h3>

                                <div className="px-2">
                                    <Slider
                                        range
                                        defaultValue={[20, 50]}
                                        disabled={disabled}
                                    />
                                </div>

                                <div className="flex justify-between gap-3 mt-6">
                                    <div className="flex flex-col items-center gap-1 w-full">
                                        <span className="text-xs text-gray-400 font-[DM_Sans] uppercase tracking-wider">Min</span>
                                        <input
                                            type="number"
                                            className="w-full p-2 text-center text-sm rounded bg-[#f5f5f5] font-semibold text-[#111111] outline-none focus:ring-1 focus:ring-[#C19D56]"
                                            value={20}
                                            readOnly
                                        />
                                    </div>
                                    <div className="flex flex-col items-center gap-1 w-full">
                                        <span className="text-xs text-gray-400 font-[DM_Sans] uppercase tracking-wider">Max</span>
                                        <input
                                            type="number"
                                            className="w-full p-2 text-center text-sm rounded bg-[#f5f5f5] font-semibold text-[#111111] outline-none focus:ring-1 focus:ring-[#C19D56]"
                                            value={50}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Categories - Ẩn bớt trên mobile nếu quá dài, ở đây mình giữ nguyên layout nhưng tút lại padding */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mt-6 shadow-sm">
                                <h3 className="relative pl-6 text-[#111111] font-[Marcellus] text-xl sm:text-2xl mb-4
                            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
                            before:w-[8px] before:h-[8px] before:rounded-full before:bg-[#C19D56]">
                                    Categories
                                </h3>
                                <ul className="space-y-2">
                                    {['Uncategorized', 'Accessories', 'Clothing', 'Hoodies', 'Music', 'Tshirts'].map((item) => (
                                        <li key={item} className="group flex items-center justify-between cursor-pointer">
                                            <span className="text-[#555] font-[DM_Sans] group-hover:text-[#C19D56] transition-colors">
                                                {item}
                                            </span>
                                            {/* Thêm mũi tên nhỏ hoặc số lượng nếu cần cho đẹp */}
                                            <span className="text-gray-300 text-sm group-hover:text-[#C19D56] transition-colors">›</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tags */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mt-6 shadow-sm">
                                <h3 className="relative pl-6 text-[#111111] font-[Marcellus] text-xl sm:text-2xl mb-4
                            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
                            before:w-[8px] before:h-[8px] before:rounded-full before:bg-[#C19D56]">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Aroma', 'Bean', 'Crema', 'Espresso', 'PerkUp', 'Roast'].map(tag => (
                                        <a key={tag} className="text-xs font-medium text-[#797979] bg-[#f6f6f8] px-3 py-2 rounded transition-all hover:bg-[#C19D56] hover:text-white cursor-pointer">
                                            {tag}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Top Products - Ẩn trên Mobile để đỡ dài dòng */}
                            <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mt-6 shadow-sm">
                                <h3 className="relative pl-6 text-[#111111] font-[Marcellus] text-xl sm:text-2xl mb-4
                            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
                            before:w-[8px] before:h-[8px] before:rounded-full before:bg-[#C19D56]">
                                    Best Sellers
                                </h3>
                                <ul className="space-y-4">
                                    {/* Demo items */}
                                    {[1, 2, 3].map(i => (
                                        <li key={i} className="flex gap-4 items-center group cursor-pointer">
                                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                {/* Placeholder img */}
                                                <div className="w-full h-full bg-gray-200 group-hover:scale-110 transition-transform"></div>
                                            </div>
                                            <div>
                                                <h4 className="font-[DM_Sans] font-bold text-[#262626] text-sm group-hover:text-[#C19D56] transition-colors">Coffee Product</h4>
                                                <div className="text-xs text-[#797979] mt-1">
                                                    <del className="mr-2">£240.00</del>
                                                    <ins className="no-underline font-semibold text-[#C19D56]">£230.00</ins>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <main className="w-full lg:w-3/4 flex flex-col">

                        {/* Toolbar: Sorting & Counting */}
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                            {(() => {
                                if (!products || products.length === 0) return <p className="text-sm text-gray-500">No results</p>;
                                const from = meta ? (meta.currentPage - 1) * meta.perPage + 1 : 0;
                                const to = from + products.length - 1;
                                return (
                                    <p className="text-sm text-[#797979] font-[DM_Sans]">
                                        Showing <span className="text-black font-semibold">{from}–{to}</span> of <span className="text-black font-semibold">{meta?.total || 0}</span>
                                    </p>
                                );
                            })()}

                            <div className="w-full sm:w-auto">
                                <select
                                    className="w-full sm:w-48 text-sm border-gray-200 rounded-md px-3 py-2 outline-none focus:border-[#C19D56] bg-gray-50 cursor-pointer"
                                    defaultValue="createdAt"
                                    value={sortBy}
                                    onChange={handleSortChange}
                                >
                                    <option value="createdAt">Default sorting</option>
                                    <option value="-createdAt">Newest items</option>
                                    <option value="priceLow">Price: Low to High</option>
                                    <option value="priceHigh">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Product List */}
                        {loading ? (
                            <div className="flex justify-center items-center h-60">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C19D56]"></div>
                            </div>
                        ) : (
                            // GRID RESPONSIVE: Mobile 2 cột (gap nhỏ), Tablet 3 cột, Desktop 3 cột
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                                {Array.isArray(products) && products?.length > 0 ? (
                                    products.map((product) => (
                                        <li
                                            key={product.id}
                                            className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl hover:border-[#C19D56]/30 transition-all duration-300"
                                        >
                                            <Link href={`/product/${product.id}`} className="block h-full flex flex-col">

                                                {/* Image Container - Aspect Square (Vuông) để đều nhau */}
                                                <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                                                    <img
                                                        src={product.thumbnail || "/images/placeholder.png"}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />

                                                    {/* Add to Cart Button (Mobile: Hiện icon, Desktop: Hiện nút khi hover) */}
                                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 px-4">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleAddToCart(product);
                                                            }}
                                                            className="w-full sm:w-auto bg-white text-[#111] hover:bg-[#C19D56] hover:text-white font-bold py-2 px-6 rounded shadow-lg text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                                                        >
                                                            <span className="hidden sm:inline">Add to cart</span>
                                                            <span className="sm:hidden text-lg">+</span> {/* Mobile chỉ hiện dấu + cho gọn */}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-3 sm:p-5 flex flex-col gap-1 sm:gap-2 flex-grow">
                                                    {/* Category (Optional) */}
                                                    <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold">Coffee</span>

                                                    <h2 className="text-sm sm:text-base font-[DM_Sans] font-bold text-[#262626] group-hover:text-[#C19D56] transition line-clamp-2 min-h-[40px] sm:min-h-[48px]">
                                                        {product.name}
                                                    </h2>

                                                    <div className="mt-auto pt-2 flex items-center gap-2">
                                                        <span className="text-[#C19D56] font-bold text-sm sm:text-lg">
                                                            {Number(product.price).toLocaleString('vi-VN')} đ
                                                        </span>
                                                        {/* Demo discount */}
                                                        <del className="text-xs text-gray-400">
                                                            {(Number(product.price) * 1.2).toLocaleString('vi-VN')} đ
                                                        </del>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <div className="col-span-full py-16 text-center bg-white rounded-lg border border-dashed border-gray-300">
                                        <p className="text-gray-500 font-[DM_Sans]">Không tìm thấy sản phẩm nào.</p>
                                    </div>
                                )}
                            </ul>
                        )}

                        {/* Pagination */}
                        {meta && meta.lastPage > 1 && (
                            <nav className="flex justify-center mt-12">
                                <ul className="flex flex-wrap justify-center gap-2">
                                    {/* Prev Button */}
                                    <li>
                                        <button
                                            disabled={meta.currentPage === 1}
                                            onClick={() => fetchProducts(meta.currentPage - 1)}
                                            className={`w-10 h-10 flex items-center justify-center rounded border transition-colors
                                        ${meta.currentPage === 1 ? 'border-gray-100 text-gray-300' : 'border-gray-300 hover:border-[#C19D56] hover:text-[#C19D56]'}`}
                                        >
                                            ←
                                        </button>
                                    </li>

                                    {/* Page Numbers */}
                                    {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((pageNumber) => (
                                        <li key={pageNumber}>
                                            <button
                                                onClick={() => fetchProducts(pageNumber)}
                                                className={`w-10 h-10 flex items-center justify-center rounded font-medium transition-all
                                            ${Number(pageNumber) === Number(meta.currentPage)
                                                        ? 'bg-[#C19D56] text-white shadow-md transform scale-105'
                                                        : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {pageNumber}
                                            </button>
                                        </li>
                                    ))}

                                    {/* Next Button */}
                                    <li>
                                        <button
                                            disabled={meta.currentPage === meta.lastPage}
                                            onClick={() => fetchProducts(meta.currentPage + 1)}
                                            className={`w-10 h-10 flex items-center justify-center rounded border transition-colors
                                        ${meta.currentPage === meta.lastPage ? 'border-gray-100 text-gray-300' : 'border-gray-300 hover:border-[#C19D56] hover:text-[#C19D56]'}`}
                                        >
                                            →
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </main>
                </div>
            </div>
        </ConfigProvider>
    );
}

export default BodyShop;
