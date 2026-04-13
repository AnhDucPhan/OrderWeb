'use client';
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, ConfigProvider, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { getSession } from 'next-auth/react';
// 👇 1. Import thêm useSearchParams để đọc URL
import { useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
    const [form] = Form.useForm();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    
    const { items: cartItems } = useSelector((state: RootState) => state.cart);
    const shippingMethod = Form.useWatch('shippingMethod', form);

    // 👇 2. SETUP STATE & LẤY MODE TỪ URL
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode'); // 'buynow' hoặc 'cart'
    const [displayItems, setDisplayItems] = useState<any[]>([]);

    // 👇 3. USE-EFFECT QUYẾT ĐỊNH XEM HIỂN THỊ MÓN NÀO
    useEffect(() => {
        if (mode === 'buynow') {
            // Luồng 1: Mua ngay -> Lấy data giả lập từ SessionStorage
            const savedItem = sessionStorage.getItem('buyNowItem');
            if (savedItem) {
                setDisplayItems([JSON.parse(savedItem)]);
            }
        } else {
            // Luồng 2: Đi từ Giỏ hàng -> Lấy mảng ID đã tick chọn
            const savedIds = sessionStorage.getItem('checkoutCartIds');
            if (savedIds && cartItems.length > 0) {
                const parsedIds = JSON.parse(savedIds);
                // Lọc ra những món trong Redux trùng với ID đã chọn
                const selectedItems = cartItems.filter(item => parsedIds.includes(item.id));
                setDisplayItems(selectedItems);
            } else if (cartItems.length > 0 && !savedIds) {
                // Fallback: Nếu không có mảng ID nào (user vào thẳng link), hiện tất cả
                setDisplayItems(cartItems);
            }
        }
    }, [mode, cartItems]);

    // 👇 4. ĐỔI CÁCH TÍNH TỔNG DỰA TRÊN MẢNG MỚI
    const total = displayItems.reduce((acc, item) => {
        const price = Number(item?.product?.price) || 0;
        const qty = item?.quantity || 0;
        return acc + (price * qty);
    }, 0);

    const onFinish = async (values: any) => {
        if (displayItems.length === 0) {
            message.warning("Không có sản phẩm nào để thanh toán!");
            return;
        }

        setIsCheckingOut(true);
        try {
            const session: any = await getSession();
            const token = session?.accessToken;

            if (!token) {
                message.error('Bạn cần đăng nhập để thanh toán!');
                setIsCheckingOut(false);
                return;
            }

            const itemsToBuy = displayItems.map((item: any) => ({
                // Tùy thuộc vào cấu trúc của Mua Ngay hay Cart mà lấy đúng productId
                productId: item.productId || item.product?.id || item.id, 
                quantity: item.quantity
            }));

            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                email: values.email || undefined,
                shippingMethod: values.shippingMethod,
                streetAddress: values.streetAddress,
                apartment: values.apartment,
                pickupTime: values.pickupTime ? dayjs(values.pickupTime).format('HH:mm') : undefined,
                orderNotes: values.orderNotes,
                itemsToBuy: itemsToBuy
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8386'}/payment/checkout`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload) 
            });

            const data = await response.json();

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                message.error(data.message || 'Không thể tạo link thanh toán lúc này!');
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            message.error('Lỗi kết nối máy chủ thanh toán!');
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#C19D56',
                    fontFamily: 'inherit',
                },
            }}
        >
            <div className="bg-[#fcfcfc] min-h-screen py-10 sm:py-16">
                <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ shippingMethod: 'delivery' }}
                        requiredMark={(label, info) => (
                            <span>
                                {label} {info.required && <span className="text-red-500">*</span>}
                            </span>
                        )}
                        className="font-[DM_Sans]"
                    >
                        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                            
                            {/* --- CỘT TRÁI: THÔNG TIN KHÁCH HÀNG --- */}
                            <div className="flex-1">
                                <h2 className="text-3xl md:text-4xl text-[#111111] mb-6 font-[Marcellus] font-normal">
                                    Chi tiết đơn hàng
                                </h2>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                    <Form.Item label="Họ" name="lastName" rules={[{ required: true, message: 'Vui lòng nhập họ' }]}>
                                        <Input size="large" className="rounded-sm" />
                                    </Form.Item>
                                    <Form.Item label="Tên" name="firstName" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                                        <Input size="large" className="rounded-sm" />
                                    </Form.Item>
                                </div>

                                <Form.Item label="Phương thức nhận hàng" name="shippingMethod" rules={[{ required: true }]}>
                                    <Select size="large" className="rounded-sm">
                                        <Select.Option value="delivery">Giao hàng tận nơi (Delivery)</Select.Option>
                                        <Select.Option value="takeaway">Đến lấy trực tiếp (Take away)</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                                    <Input size="large" className="rounded-sm" placeholder="VD: 0901234567" />
                                </Form.Item>
                                
                                {shippingMethod === 'delivery' && (
                                    <div className="animate-fadeIn">
                                        <Form.Item label="Địa chỉ giao hàng" name="streetAddress" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                                            <Input size="large" placeholder="Số nhà, tên đường, phường/xã..." className="rounded-sm mb-3" />
                                        </Form.Item>
                                        <Form.Item name="apartment">
                                            <Input size="large" placeholder="Ghi chú thêm về địa chỉ (Tòa nhà, số tầng...)" className="rounded-sm" />
                                        </Form.Item>
                                    </div>
                                )}

                                {shippingMethod === 'takeaway' && (
                                    <div className="animate-fadeIn">
                                        <Form.Item 
                                            label="Giờ lấy đơn dự kiến" 
                                            name="pickupTime" 
                                            rules={[{ required: true, message: 'Vui lòng chọn giờ lấy hàng' }]}
                                        >
                                            <TimePicker 
                                                size="large" 
                                                format="HH:mm" 
                                                className="w-full rounded-sm" 
                                                placeholder="Chọn thời gian"
                                                minuteStep={15}
                                                disabledTime={() => ({
                                                    disabledHours: () => [0,1,2,3,4,5,6,22,23],
                                                })}
                                            />
                                        </Form.Item>
                                        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-700 mb-6">
                                            Bạn vui lòng đến cửa hàng kiểm tra đơn hàng và nhận nước theo khung giờ đã chọn.
                                        </div>
                                    </div>
                                )}

                                <Form.Item label="Địa chỉ Email (Để nhận hóa đơn)" name="email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
                                    <Input size="large" className="rounded-sm" />
                                </Form.Item>
                            </div>

                            {/* --- CỘT PHẢI: GHI CHÚ BỔ SUNG --- */}
                            <div className="flex-1">
                                <h2 className="text-3xl md:text-4xl text-[#111111] mb-6 font-[Marcellus] font-normal">
                                    Thông tin bổ sung
                                </h2>
                                <Form.Item label="Ghi chú đơn hàng (Tùy chọn)" name="orderNotes">
                                    <Input.TextArea 
                                        rows={6} 
                                        placeholder="Ghi chú về đơn hàng của bạn, ví dụ: ít đường, nhiều đá, địa chỉ khó tìm..." 
                                        className="rounded-sm resize-y"
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        {/* --- BẢNG ĐƠN HÀNG --- */}
                        <div className="mt-16">
                            <h2 className="text-3xl md:text-4xl text-[#111111] mb-6 font-[Marcellus] font-normal">
                                Đơn hàng của bạn
                            </h2>

                            <div className="border border-gray-200 rounded-sm bg-white overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="py-4 px-5 text-[#555] font-bold text-base w-2/3">Sản phẩm</th>
                                            <th className="py-4 px-5 text-[#555] font-bold text-base w-1/3 text-right">Tạm tính</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[#555]">
                                        {/* 👇 6. RENDER DỰA TRÊN displayItems (Thay vì cartItems) */}
                                        {displayItems.length > 0 ? displayItems.map((item, idx) => (
                                            <tr key={item.id || idx} className="border-b border-gray-100">
                                                <td className="py-4 px-5">
                                                    <span className="font-bold text-[#222]">{item?.product?.name}</span> <span className="text-gray-500">× {item?.quantity}</span>
                                                </td>
                                                <td className="py-4 px-5 font-bold text-[#222] text-right">
                                                    {((item?.product?.price || 0) * (item?.quantity || 1)).toLocaleString('vi-VN')} đ
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr className="border-b border-gray-100">
                                                <td colSpan={2} className="py-8 px-5 text-center text-gray-400">Bạn chưa chọn mua sản phẩm nào</td>
                                            </tr>
                                        )}
                                        
                                        <tr>
                                            <td className="py-4 px-5 font-bold text-[#555] text-lg">Tổng cộng</td>
                                            <td className="py-4 px-5 font-bold text-[#C19D56] text-xl text-right">{total.toLocaleString('vi-VN')} đ</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Nút Đặt Hàng */}
                            <div className="mt-8 flex justify-end">
                                <button 
                                    type="submit"
                                    disabled={displayItems.length === 0 || isCheckingOut}
                                    className={`px-10 py-4 font-bold tracking-widest transition-all duration-300 uppercase
                                        ${displayItems.length === 0 || isCheckingOut ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#111111] text-white! hover:bg-[#C19D56]'}`}
                                >
                                    {isCheckingOut ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG VÀ THANH TOÁN'}
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </ConfigProvider>
    );
}