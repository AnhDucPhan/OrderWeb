'use client'
import React, { useEffect, useState } from 'react';
import { Drawer, Button, ConfigProvider, Badge } from 'antd';
import { MdAddShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { getCartAPI } from '@/lib/features/ui/cartSlice';
import { useRouter } from 'next/navigation';

const CartDrawer = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { items: cartItems } = useSelector((state: RootState) => state.cart);
    const router = useRouter();

    // 👇 1. SỬA LỖI TÍNH TỔNG TIỀN (Thêm ?. và || 0)
    const subTotal = cartItems.reduce((acc, item) => {
        const price = Number(item?.product?.price) || 0;
        const qty = item?.quantity || 0;
        return acc + (price * qty);
    }, 0);

    const handleRemoveItem = (id: number) => {
        console.log("Cần viết thêm API Delete Cart Item cho id:", id);
    };

    useEffect(() => {
        dispatch(getCartAPI());
    }, [dispatch]);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#C19D56',
                },
            }}
        >
            {/* 1. NÚT GIỎ HÀNG TREO LƠ LỬNG BÊN PHẢI */}
            <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-[999]">
                <Badge count={cartItems.length} offset={[-5, 5]} color="#111111">
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-[#C19D56] text-white p-3 rounded-l-lg shadow-[0_4px_14px_rgba(0,0,0,0.3)]
                                   hover:bg-[#a38446] transition-all duration-300 group flex flex-col items-center gap-1"
                    >
                        <MdAddShoppingCart />
                        <span className="text-[10px] font-bold uppercase hidden sm:block writing-mode-vertical">
                            Cart
                        </span>
                    </button>
                </Badge>
            </div>

            {/* 2. DRAWER HIỂN THỊ DANH SÁCH SẢN PHẨM */}
            <Drawer
                title={
                    <div className="flex justify-between items-center">
                        <span className="font-[Marcellus] text-[#111111] text-xl">Shopping Cart</span>
                        <span className="text-gray-500 text-sm font-normal">{cartItems.length} items</span>
                    </div>
                }
                placement="right"
                onClose={() => setOpen(false)}
                open={open}
                width={380}
                className="font-[DM_Sans]"
                footer={
                    <div className="flex flex-col gap-4 p-2">
                        {/* Tổng tiền */}
                        <div className="flex justify-between text-lg font-bold text-[#111111]">
                            <span>Subtotal:</span>
                            <span className="text-[#C19D56]">{subTotal.toLocaleString('vi-VN')} đ</span>
                        </div>

                        {/* Nhóm 2 nút Giỏ Hàng và Checkout nằm ngang */}
                        <div className="flex gap-3">
                            <Button
                                size="large"
                                className="..."
                                onClick={() => {
                                    setOpen(false); // 1. Đóng Drawer lại cho gọn gàng
                                    router.push('shop/cart'); // 2. Đẩy sang trang Giỏ Hàng
                                }}
                            >
                                GIỎ HÀNG
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                className="flex-1 h-12 text-base font-bold bg-[#111111] hover:!bg-[#C19D56] border-none"
                                onClick={() => {
                                    setOpen(false);
                                    alert("Chuyển trang Checkout..."); // Thay bằng router.push('/checkout')
                                }}
                            >
                                CHECKOUT
                            </Button>
                        </div>

                        {/* Nút Continue Shopping */}
                        <Button
                            type="text"
                            onClick={() => setOpen(false)}
                            className="text-gray-500 hover:!text-[#111111]"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                }
            >
                {/* 3. NỘI DUNG DANH SÁCH SẢN PHẨM */}
                {cartItems.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0">
                                {/* Ảnh nhỏ */}
                                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <img
                                        // 👇 2. BẢO VỆ ẢNH: Nếu không có ảnh thì lấy ảnh mặc định
                                        src={item?.product?.thumbnail || '/images/placeholder.png'}
                                        alt={item?.product?.name || 'Sản phẩm'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Thông tin */}
                                <div className="flex-1 flex flex-col justify-between h-20">
                                    <div>
                                        {/* 👇 3. BẢO VỆ TÊN & GIÁ TIỀN */}
                                        <h4 className="text-[#111111] font-bold line-clamp-1">
                                            {item?.product?.name || 'Sản phẩm không xác định'}
                                        </h4>
                                        <p className="text-[#C19D56] font-medium">
                                            {Number(item?.product?.price || 0).toLocaleString('vi-VN')} đ
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Qty: {item?.quantity || 0}</span>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 text-xs underline transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col justify-center items-center gap-4 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <p>Your cart is empty.</p>
                    </div>
                )}
            </Drawer>
        </ConfigProvider>
    );
};

export default CartDrawer;