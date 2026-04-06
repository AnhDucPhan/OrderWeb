'use client'
import { addToCartAPI } from '@/lib/features/cartSlice';
import { openLoginModal } from '@/lib/features/ui/uiSlice';
import { AppDispatch } from '@/lib/store';
import { ConfigProvider, message } from 'antd';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from "react";
import { useDispatch } from 'react-redux';

import { useGetProductsQuery, Product } from '@/services/productApi';
import { useGetProductCategoriesQuery } from '@/services/productCategoryApi';

const BodyShop = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: session } = useSession();

    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const { data: categoriesData = [] } = useGetProductCategoriesQuery();

    let orderBy = 'createdAt';
    let sortDir = 'desc';

    switch (sortBy) {
        case 'createdAt':
            orderBy = 'createdAt';
            sortDir = 'asc';
            break;
        case '-createdAt':
            orderBy = 'createdAt';
            sortDir = 'desc';
            break;
        case 'priceLow':
            orderBy = 'price';
            sortDir = 'asc';
            break;
        case 'priceHigh':
            orderBy = 'price';
            sortDir = 'desc';
            break;
        default:
            break;
    }

    const { data: responseData, isLoading, isFetching } = useGetProductsQuery({
        page: page,
        items_per_page: 9,
        orderBy: orderBy,
        sort: sortDir,
        productCategoryId: selectedCategory || undefined,
        isActive: true,
    });

    const products: Product[] = responseData?.data || [];
    const meta = responseData?.meta || null;
    const loading = isLoading || isFetching;

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setPage(1);
    };

    const handleCategoryClick = (categoryId: number | null) => {
        setSelectedCategory(categoryId);
        setPage(1);
    };

    const handleAddToCart = (product: Product) => {
        if (!session) {
            message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
            dispatch(openLoginModal());
            return;
        }

        dispatch(addToCartAPI({
            productId: product.id,
            quantity: 1,
        }))
            .unwrap()
            .then(() => {
                message.success(`Đã thêm ${product.name} vào giỏ!`);
            })
            .catch(() => {
                message.error('Thêm thất bại!');
            });
    };

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
            {/* 👇 GẮN FONT MARCELLUS CHO TOÀN BỘ TRANG TẠI ĐÂY */}
            <div className='bg-[#fcfcfc] min-h-screen py-8 sm:py-12 font-[Marcellus]'>
                <div className="w-full max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb Section */}
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-3xl md:text-4xl text-[#111111] mb-2 font-semibold">Shopping Now</h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            <Link href="/" className="hover:text-[#C19D56] transition-colors">Home</Link> / Shop
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start relative">

                        {/* --- SIDEBAR FILTER --- */}
                        <div className="w-full lg:w-1/4 flex-shrink-0 space-y-6 lg:sticky lg:top-4">
                            {/* Categories */}
                            <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                                <h3 className="relative pl-5 text-[#111111] text-xl sm:text-2xl mb-4 font-semibold
                            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
                            before:w-[8px] before:h-[8px] before:rounded-full before:bg-[#C19D56]">
                                    Categories
                                </h3>

                                <ul className="space-y-1">
                                    <li className="py-1">
                                        <span
                                            onClick={() => handleCategoryClick(null)}
                                            className={`text-sm sm:text-base transition-colors cursor-pointer block 
                                                ${selectedCategory === null ? 'text-[#C19D56] font-bold' : 'text-[#555] hover:text-[#C19D56]'}`}
                                        >
                                            Tất cả sản phẩm
                                        </span>
                                    </li>

                                    {categoriesData.map((item: any) => (
                                        <li key={item.id} className="py-1">
                                            <span
                                                onClick={() => handleCategoryClick(item.id)}
                                                className={`text-sm sm:text-base transition-colors cursor-pointer block 
                                                    ${selectedCategory === item.id ? 'text-[#C19D56] font-bold' : 'text-[#555] hover:text-[#C19D56]'}`}
                                            >
                                                {item.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Product Tags */}
                            <div className='border border-gray-200 rounded-2xl p-5 bg-white shadow-sm'>
                                <h3 className="relative pl-5 text-[#111111] text-xl sm:text-2xl mb-4 font-semibold
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

                            {/* Sidebar Products List */}
                            <div className='border border-gray-200 rounded-2xl p-5 bg-white shadow-sm'>
                                <h3 className="relative pl-5 text-[#111111] text-xl sm:text-2xl mb-4 font-semibold
                            before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2
                            before:w-[8px] before:h-[8px] before:rounded-full before:bg-[#C19D56]">
                                    Best Sellers
                                </h3>
                                <ul className="space-y-4">
                                    {['Dispensing Tray', 'Coffee Capsule', 'Dolce Gusto', 'Measuring Cup'].map((item) => (
                                        <li key={item}>
                                            <a className="text-sm sm:text-base font-bold text-[#262626] hover:text-[#C19D56] transition-colors block">
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
                        <div className="w-full lg:w-3/4 flex flex-col">

                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-b border-gray-100 mb-6">
                                {(() => {
                                    if (!products || products.length === 0) return <p className="text-sm text-gray-500">No products found</p>;
                                    const from = meta ? (meta.currentPage - 1) * meta.perPage + 1 : 0;
                                    const to = from + products.length - 1;
                                    return (
                                        <p className="text-sm text-[#797979]">
                                            Showing <span className="text-[#111] font-medium">{from}–{to}</span> of <span className="text-[#111] font-medium">{meta?.total || 0}</span> results
                                        </p>
                                    );
                                })()}

                                <form className="w-full sm:w-auto">
                                    <select
                                        className="w-full sm:w-auto text-sm border border-gray-200 rounded px-3 py-2 outline-none bg-white cursor-pointer hover:border-[#C19D56] focus:border-[#C19D56] transition-colors"
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
                                    <div className="w-8 h-8 border-4 border-[#C19D56] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                                    {Array.isArray(products) && products?.length > 0 ? (
                                        products.map((product) => (
                                            <li key={product.id} className="group relative flex flex-col gap-3 border border-gray-200 rounded-2xl p-3 sm:p-4 bg-white hover:border-[#C19D56] hover:shadow-xl transition-all duration-300">

                                                {/* 👇 Đã thay thẻ <a href="#"> bằng thẻ <Link> duy nhất */}
                                                <Link href={`/shop/${product.id}`} className="block w-full">

                                                    <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-[#f9f9f9] border border-gray-100">
                                                        {/* Ảnh sản phẩm (Đã gỡ bỏ thẻ <Link> thừa lồng bên trong lúc nãy) */}
                                                        <img
                                                            src={product.thumbnail || "/images/placeholder.png"}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />

                                                        {/* Khối Button Add To Cart */}
                                                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex justify-center">
                                                            <button
                                                                className="bg-white text-[#111] hover:bg-[#C19D56] hover:text-white font-bold py-2 px-4 rounded shadow-lg text-xs sm:text-sm whitespace-nowrap"
                                                                onClick={(e) => {
                                                                    e.preventDefault(); // Ngăn chặn sự kiện mặc định
                                                                    e.stopPropagation(); // 👈 BẮT BUỘC CÓ: Ngăn sự kiện click lan lên thẻ <Link> cha
                                                                    handleAddToCart(product);
                                                                }}
                                                            >
                                                                Add to cart
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Khối Thông tin Text */}
                                                    <div className="mt-4 text-center px-1">
                                                        <h2 className="text-sm sm:text-base font-[DM_Sans] font-bold text-[#262626] group-hover:text-[#C19D56] transition line-clamp-2 h-[40px] sm:h-[48px] leading-tight">
                                                            {product.name}
                                                        </h2>
                                                        <p className="text-[#C19D56] font-bold mt-1 text-sm sm:text-base">
                                                            {Number(product.price).toLocaleString('vi-VN')} đ
                                                        </p>
                                                    </div>

                                                </Link>

                                            </li>
                                        ))
                                    ) : (
                                        <p className="col-span-full text-center text-gray-500 py-10">
                                            Không tìm thấy sản phẩm nào.
                                        </p>
                                    )}
                                </ul>
                            )}

                            {/* Pagination */}
                            {meta && meta.lastPage > 1 && (
                                <nav className="flex justify-center mt-12">
                                    <ul className="flex gap-2 items-center">
                                        <li>
                                            <button
                                                disabled={meta.currentPage === 1}
                                                onClick={() => setPage(meta.currentPage - 1)}
                                                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded border border-gray-200 transition-colors
                                            ${meta.currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#111] hover:bg-[#C19D56] hover:text-white hover:border-[#C19D56]'}`}
                                            >
                                                &#8592;
                                            </button>
                                        </li>
                                        {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((pageNumber) => (
                                            <li key={pageNumber}>
                                                <button
                                                    onClick={() => setPage(pageNumber)}
                                                    className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded border transition-colors font-medium text-sm
                                                ${Number(pageNumber) === Number(meta.currentPage)
                                                            ? 'bg-[#111] !text-white border-[#111]'
                                                            : 'text-[#111] border-gray-200 hover:bg-[#C19D56] hover:text-white hover:border-[#C19D56]'}`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            </li>
                                        ))}
                                        <li>
                                            <button
                                                disabled={meta.currentPage === meta.lastPage}
                                                onClick={() => setPage(meta.currentPage + 1)}
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