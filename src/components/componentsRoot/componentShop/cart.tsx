'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConfigProvider, InputNumber, Button, Divider, Input, Modal, message, Checkbox } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { removeCartItemAPI, updateQuantity } from '@/lib/features/ui/cartSlice';
import { useRouter } from 'next/navigation';

const CartComponent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [modal, contextHolder] = Modal.useModal();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const router = useRouter();

    // Lấy data từ Redux
    const { items: cartItems } = useSelector((state: RootState) => state.cart);

    // 👇 1. STATE QUẢN LÝ CÁC SẢN PHẨM ĐƯỢC CHỌN
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Tự động dọn dẹp selectedIds nếu người dùng xóa 1 sản phẩm khỏi giỏ
    useEffect(() => {
        setSelectedIds(prev => prev.filter(id => cartItems.some(item => item.id === id)));
    }, [cartItems]);

    // 👇 2. CHỈ TÍNH TỔNG TIỀN CÁC SẢN PHẨM ĐƯỢC CHỌN
    const subTotal = cartItems
        .filter(item => selectedIds.includes(item.id))
        .reduce((total, item) => {
            const price = Number(item?.product?.price) || 0;
            const qty = item?.quantity || 0;
            return total + (price * qty);
        }, 0);

    const total = subTotal;

    // 👇 3. CÁC HÀM XỬ LÝ CHECKBOX
    const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < cartItems.length;

    const handleSelectAll = (e: any) => {
        if (e.target.checked) {
            setSelectedIds(cartItems.map((item: any) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectItem = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(itemId => itemId !== id));
        }
    };

    const handleQuantityChange = (id: number, value: number | null) => {
        if (value !== null && value > 0) {
            dispatch(updateQuantity({ id, quantity: value }));
        }
    };

    const handleRemoveItem = (itemId: number) => {
        modal.confirm({
            title: 'Xác nhận xóa?',
            content: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?',
            okText: 'Có, Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: async () => {
                try {
                    await dispatch(removeCartItemAPI(itemId)).unwrap();
                    message.success('Đã xóa sản phẩm khỏi giỏ hàng!');
                } catch (error) {
                    console.error("Lỗi xóa:", error);
                    message.error('Xóa sản phẩm thất bại');
                }
            }
        });
    }

    // 👇 4. HÀM XỬ LÝ KHI BẤM THANH TOÁN
    const handleCheckout = () => {
        if (selectedIds.length === 0) {
            message.warning('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!');
            return;
        }

        // Lưu danh sách ID các món muốn mua vào sessionStorage để trang Checkout đọc
        sessionStorage.setItem('checkoutCartIds', JSON.stringify(selectedIds));
        router.push('/shop/checkout?mode=cart');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 bg-white px-4">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-[#C19D56]">
                    <ShoppingCartOutlined style={{ fontSize: '48px' }} />
                </div>
                <h2 className="text-2xl font-[Marcellus] text-[#111111]">Giỏ hàng của bạn đang trống.</h2>
                <Link href="/shop">
                    <button className="bg-[#111111] !text-white px-8 py-3 rounded hover:bg-[#C19D56] transition-all duration-300 font-[DM_Sans] font-bold uppercase tracking-wider">
                        Tiếp tục mua sắm
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <ConfigProvider
            theme={{
                token: { colorPrimary: '#C19D56', borderRadius: 0 },
                components: {
                    Input: { activeBorderColor: '#C19D56', hoverBorderColor: '#C19D56' },
                    InputNumber: { activeBorderColor: '#C19D56', hoverBorderColor: '#C19D56' },
                }
            }}
        >
            {contextHolder}
            <div className="bg-[#fcfcfc] min-h-screen py-10 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-24">

                    <div className="mb-10 text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-[Marcellus] text-[#111111] mb-2">Giỏ hàng</h1>
                        <p className="text-gray-500 font-[DM_Sans]">
                            <Link href="/" className="hover:text-[#C19D56]">Trang chủ</Link> / Giỏ hàng
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
                        <div className="w-full lg:basis-2/3">
                            {/* Tiêu đề bảng */}
                            <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 text-sm font-bold text-gray-400 uppercase tracking-wider font-[DM_Sans]">
                                <div className="col-span-6 flex items-center gap-3">
                                    <Checkbox
                                        indeterminate={isIndeterminate}
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                    />
                                    <span>Sản phẩm</span>
                                </div>
                                <div className="col-span-2 text-center">Giá</div>
                                <div className="col-span-2 text-center">Số lượng</div>
                                <div className="col-span-2 text-right">Tổng cộng</div>
                            </div>

                            <div className="flex flex-col gap-6 mt-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="group relative bg-white border border-gray-100 p-4 rounded-lg sm:border-0 sm:bg-transparent sm:p-0 sm:rounded-none flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center shadow-sm sm:shadow-none">

                                        <div className="relative col-span-6 flex gap-4 w-full items-center">
                                            {/* Checkbox trên Mobile sẽ đặt góc trên trái, Desktop thì căn giữa */}
                                            <div className="absolute top-4 left-4 sm:static sm:flex items-center z-10">
                                                <Checkbox
                                                    checked={selectedIds.includes(item.id)}
                                                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                                />
                                            </div>

                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="absolute top-4 right-4 sm:static text-gray-400 hover:text-red-500 transition-colors z-10"
                                            >
                                                <DeleteOutlined />
                                            </button>

                                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 flex-shrink-0 overflow-hidden rounded border border-gray-200 ml-8 sm:ml-0">
                                                <img
                                                    src={item?.product?.thumbnail || '/images/placeholder.png'}
                                                    alt={item?.product?.name || 'Sản phẩm'}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <Link href={`/shop/${item?.product?.id}`} className="text-[#111111] font-[DM_Sans] font-bold text-lg hover:text-[#C19D56] transition line-clamp-1">
                                                    {item?.product?.name || 'Chưa cập nhật'}
                                                </Link>
                                                <span className="text-sm text-gray-400 mt-1">Phân loại: Mặc định</span>
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-center hidden sm:block font-[DM_Sans] text-gray-600">
                                            {Number(item?.product?.price || 0).toLocaleString('vi-VN')} đ
                                        </div>

                                        <div className="col-span-2 flex justify-between sm:justify-center items-center w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-0 pt-4 sm:pt-0 border-gray-100">
                                            <span className="sm:hidden text-gray-500 font-medium">Số lượng:</span>
                                            <div className="custom-input-number">
                                                <InputNumber
                                                    min={1}
                                                    max={99}
                                                    value={item?.quantity || 1}
                                                    onChange={(val) => handleQuantityChange(item.id, val)}
                                                    className="w-16"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-right w-full sm:w-auto flex justify-between sm:block mt-2 sm:mt-0">
                                            <span className="sm:hidden text-gray-500 font-medium">Tổng:</span>
                                            <span className="text-[#C19D56] font-bold font-[DM_Sans]">
                                                {(Number(item?.product?.price || 0) * (item?.quantity || 1)).toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-between items-center">
                                <Link href="/shop" className="flex items-center gap-2 text-[#111111] font-bold hover:text-[#C19D56] transition">
                                    <ArrowLeftOutlined /> Tiếp tục mua sắm
                                </Link>
                                <button className="text-gray-400 hover:text-[#111111] font-[DM_Sans] text-sm underline">
                                    Xóa toàn bộ giỏ hàng
                                </button>
                            </div>
                        </div>

                        {/* --- CỘT PHẢI: ORDER SUMMARY --- */}
                        <div className="w-full lg:basis-1/3">
                            <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm sticky top-24">
                                <h3 className="text-xl font-[Marcellus] text-[#111111] mb-6 border-b border-gray-100 pb-4">
                                    Thông tin đơn hàng
                                </h3>

                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600 font-[DM_Sans]">Tạm tính ({selectedIds.length} món)</span>
                                    <span className="text-[#111111] font-bold font-[DM_Sans]">
                                        {subTotal.toLocaleString('vi-VN')} đ
                                    </span>
                                </div>

                                <div className="my-6">
                                    <p className="text-sm text-gray-500 mb-2">Bạn có mã giảm giá?</p>
                                    <div className="flex gap-2">
                                        <Input placeholder="Nhập mã giảm giá" className="font-[DM_Sans]" />
                                        <Button type="default" className="border-[#111111] text-[#111111] hover:!border-[#C19D56] hover:!text-[#C19D56]">
                                            Áp dụng
                                        </Button>
                                    </div>
                                </div>

                                <Divider />

                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-lg font-bold text-[#111111] font-[Marcellus]">Thành tiền</span>
                                    <span className="text-2xl font-bold text-[#C19D56] font-[DM_Sans]">
                                        {total.toLocaleString('vi-VN')} đ
                                    </span>
                                </div>

                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    onClick={handleCheckout} // 👈 GỌI HÀM MỚI Ở ĐÂY
                                    loading={isCheckingOut}
                                    className="h-14 text-base font-bold bg-[#111111] hover:!bg-[#C19D56] uppercase tracking-widest"
                                >
                                    {isCheckingOut ? 'Đang xử lý...' : 'Thanh toán ngay'}
                                </Button>

                                <div className="mt-6 text-center">
                                    <p className="text-xs text-gray-400 mb-2">Thanh toán an toàn & bảo mật</p>
                                    <div className="flex justify-center gap-2 opacity-60 grayscale hover:grayscale-0 transition">
                                        <div className="w-10 h-6 bg-blue-100 rounded flex items-center justify-center text-[9px] font-bold text-blue-800">VNPay</div>
                                        <div className="w-10 h-6 bg-pink-100 rounded flex items-center justify-center text-[9px] font-bold text-pink-600">MoMo</div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
}

export default CartComponent;