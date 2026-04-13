'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// 👇 Import thêm useRouter ở đây
import { useParams, useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { addToCartAPI } from '@/lib/features/cartSlice';
import { openLoginModal } from '@/lib/features/ui/uiSlice';
import { useSession } from 'next-auth/react';
import { message } from 'antd';

import { useGetOneProductQuery, Product } from '@/services/productApi';

const ProductDetailComp = () => {
    const { id } = useParams<{ id: string }>(); 
    // 👇 Khởi tạo router
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { data: session } = useSession();

    const [quantity, setQuantity] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<'description' | 'additional' | 'reviews'>('description');

    const { data: responseData, isLoading, isError } = useGetOneProductQuery(Number(id), {
        skip: !id, 
    });

    const product = (responseData as any)?.data || responseData as Product | undefined;

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val > 0) setQuantity(val);
    };

    // Hàm Thêm vào giỏ hàng
    const handleAddToCart = () => {
        if (!product) return;
        
        if (!session) {
            message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
            dispatch(openLoginModal());
            return;
        }

        dispatch(addToCartAPI({
            productId: product.id,
            quantity: quantity,
        }))
            .unwrap()
            .then(() => {
                message.success(`Đã thêm ${quantity} ${product.name} vào giỏ!`);
            })
            .catch(() => {
                message.error('Thêm thất bại!');
            });
    };

    // 👇 Hàm Mua Ngay (Bỏ qua giỏ hàng -> Sang thẳng trang thanh toán)
    const handleBuyNow = () => {
        if (!product) return;
        
        if (!session) {
            message.warning('Vui lòng đăng nhập để mua hàng!');
            dispatch(openLoginModal());
            return;
        }

        // 1. Tạo 1 object giả lập giống cấu trúc CartItem để trang Checkout dễ đọc
        const buyNowData = {
            id: 'buynow_item', 
            productId: product.id,
            quantity: quantity,
            product: product // Chứa sẵn name, price, thumbnail... để hiện thị ra bảng
        };

        // 2. Lưu tạm vào bộ nhớ ảo của trình duyệt
        sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowData));

        // 3. Đẩy thẳng sang trang Checkout và gắn thêm cờ nhận diện ?mode=buynow
        router.push('/shop/checkout?mode=buynow');
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#C19D56]">
                <Loader2 className="animate-spin w-10 h-10 mb-4" />
                <p>Đang tải thông tin sản phẩm...</p>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-stone-500">
                <h2 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h2>
                <Link href="/shop" className="text-[#C19D56] hover:underline">Quay lại cửa hàng</Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 font-[DM_Sans]">
            {/* Breadcrumb */}
            <div className="text-sm text-stone-400 mb-8">
                <Link href="/" className="hover:text-[#C19D56] transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <Link href="/shop" className="hover:text-[#C19D56] transition-colors">
                    {product.productCategory?.name || 'Shop'}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-stone-600">{product.name}</span>
            </div>

            {/* Main Product Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                
                {/* Left: Product Image */}
                <div className="relative border border-[#C19D56] aspect-square flex items-center justify-center p-8 bg-white group">
                    <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors z-10 text-stone-600">
                        <Search size={18} />
                    </button>
                    
                    <div className="relative w-full h-full">
                        <Image
                            src={product.thumbnail && product.thumbnail.trim() !== "" ? product.thumbnail : "/images/placeholder.png"} 
                            alt={product.name}
                            fill
                            className="object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105" 
                        />
                    </div>
                </div>

                {/* Right: Product Info */}
                <div className="flex flex-col">
                    <h1 className="text-4xl md:text-5xl font-[Marcellus] text-stone-900 mb-3 tracking-tight">
                        {product.name}
                    </h1>
                    <p className="text-xl font-medium text-[#C19D56] mb-6">
                        {Number(product.price).toLocaleString('vi-VN')} đ
                    </p>

                    <div className="text-stone-500 text-sm leading-relaxed space-y-6 mb-8">
                        <p className="whitespace-pre-wrap">
                            {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                        </p>
                    </div>

                    {/* 👇 SỬA LẠI LAYOUT CHỖ NÀY */}
                    <div className="flex flex-col gap-6 py-8 border-y border-stone-100 mb-8">
                        {/* Dòng 1: Số lượng */}
                        <div className="flex items-center gap-4">
                            <span className="text-stone-800 font-bold uppercase text-sm tracking-wider">Số lượng:</span>
                            <input
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                                className="w-16 h-12 bg-stone-100 border-none text-center text-stone-700 font-semibold outline-none focus:ring-2 focus:ring-[#C19D56]"
                            />
                        </div>

                        {/* Dòng 2: 2 Nút Add to Cart và Buy Now */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 h-12 border-2 border-[#C19D56] text-[#C19D56] hover:bg-[#C19D56] hover:text-white font-bold text-sm tracking-wider transition-all duration-300 uppercase"
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                className="flex-1 h-12 bg-[#111111] hover:bg-[#C19D56] text-white! font-bold text-sm tracking-wider transition-all duration-300 shadow-md hover:shadow-lg uppercase"
                            >
                                Mua Ngay
                            </button>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="text-sm space-y-2 text-stone-500">
                        <p>
                            <span className="text-stone-900 font-bold mr-1">SKU:</span> 
                            SP-{product.id.toString().padStart(5, '0')}
                        </p>
                        <p>
                            <span className="text-stone-900 font-bold mr-1">Category:</span> 
                            <Link href="/shop" className="hover:text-[#C19D56] transition-colors">
                                {product.productCategory?.name || 'Uncategorized'}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom: Tabs Section */}
            <div className="mt-16 sm:mt-24">
                {/* Tab Headers */}
                <div className="flex flex-wrap gap-1 border-b border-[#C19D56]">
                    <button 
                        onClick={() => setActiveTab('description')}
                        className={`px-8 py-3.5 text-sm font-bold transition-colors ${
                            activeTab === 'description' 
                            ? 'bg-[#86624A] text-white' 
                            : 'bg-[#C19D56] text-white hover:bg-[#86624A]/90'
                        }`}
                    >
                        Description
                    </button>
                    <button 
                        onClick={() => setActiveTab('additional')}
                        className={`px-8 py-3.5 text-sm font-bold transition-colors ${
                            activeTab === 'additional' 
                            ? 'bg-[#86624A] text-white' 
                            : 'bg-[#C19D56] text-white hover:bg-[#86624A]/90'
                        }`}
                    >
                        Additional information
                    </button>
                    <button 
                        onClick={() => setActiveTab('reviews')}
                        className={`px-8 py-3.5 text-sm font-bold transition-colors ${
                            activeTab === 'reviews' 
                            ? 'bg-[#86624A] text-white' 
                            : 'bg-[#C19D56] text-white hover:bg-[#86624A]/90'
                        }`}
                    >
                        Reviews (0)
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-8 border border-t-0 border-[#C19D56] min-h-[150px]">
                    {activeTab === 'description' && (
                        <p className="text-stone-500 text-sm leading-relaxed whitespace-pre-wrap">
                            {product.description || "Chưa có thông tin mô tả cho sản phẩm này."}
                        </p>
                    )}
                    {activeTab === 'additional' && (
                        <div className="text-stone-500 text-sm leading-relaxed">
                            <p><strong>Cập nhật lần cuối:</strong> {new Date(product.createdAt).toLocaleDateString('vi-VN')}</p>
                            <p><strong>Trạng thái:</strong> {product.isActive ? 'Đang bán' : 'Ngừng bán'}</p>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <p className="text-stone-500 text-sm leading-relaxed italic">
                            There are no reviews yet. Be the first to review this product!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailComp;