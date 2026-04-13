'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConfigProvider, Tag, Button, Modal, Divider, Empty, message } from 'antd';
import { EyeOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';

const OrderHistoryComp = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Lấy token từ NextAuth
                const token = (session as any)?.accessToken || (session?.user as any)?.accessToken || (session?.user as any)?.token || '';

                if (!token) return;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8386'}/order/history`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    
                    // 👇 FIX LỖI Ở ĐÂY: Trích xuất đúng mảng dữ liệu từ result.data
                    if (result.success && Array.isArray(result.data)) {
                        setOrders(result.data);
                    } else {
                        // Trường hợp API trả về mảng trực tiếp (đề phòng bạn đổi logic BE)
                        setOrders(Array.isArray(result) ? result : []);
                    }
                } else {
                    message.error("Không thể tải lịch sử đơn hàng");
                }
            } catch (error) {
                console.error("Lỗi lấy lịch sử đơn hàng:", error);
                message.error("Lỗi kết nối đến máy chủ");
            } finally {
                setIsLoading(false); 
            }
        };

        // Đợi session load xong mới gọi API
        if (status === 'authenticated') {
            fetchOrders();
        } else if (status === 'unauthenticated') {
            setIsLoading(false); // Chưa đăng nhập thì tắt loading luôn
        }
    }, [session, status]);

    const showOrderDetails = (order: any) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    // Hàm render màu sắc Tag trạng thái
    const renderOrderStatus = (status: string) => {
        switch (status) {
            case 'PENDING': return <Tag color="processing" className="font-[DM_Sans] rounded-full px-3 m-0">Chờ xác nhận</Tag>;
            case 'PROCESSING': return <Tag color="warning" className="font-[DM_Sans] rounded-full px-3 m-0">Đang chuẩn bị</Tag>;
            case 'SHIPPED': return <Tag color="purple" className="font-[DM_Sans] rounded-full px-3 m-0">Đang giao hàng</Tag>;
            case 'COMPLETED': return <Tag color="success" className="font-[DM_Sans] rounded-full px-3 m-0">Hoàn thành</Tag>;
            case 'CANCELLED': return <Tag color="error" className="font-[DM_Sans] rounded-full px-3 m-0">Đã hủy</Tag>;
            default: return <Tag className="m-0">{status}</Tag>;
        }
    };

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#C19D56', borderRadius: 4 } }}>
            <div className="bg-[#fcfcfc] min-h-screen py-10 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-24 max-w-6xl">

                    {/* Header */}
                    <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-[Marcellus] text-[#111111] mb-2">Lịch sử mua hàng</h1>
                            <p className="text-gray-500 font-[DM_Sans]">
                                <Link href="/" className="hover:text-[#C19D56]">Trang chủ</Link> /
                                <Link href="/my-account" className="hover:text-[#C19D56]"> Tài khoản</Link> / Đơn hàng
                            </p>
                        </div>
                        <Link href="/shop">
                            <Button type="default" icon={<ShoppingOutlined />} className="font-[DM_Sans] border-[#111111] text-[#111111] hover:!border-[#C19D56] hover:!text-[#C19D56] h-10 px-6">
                                Tiếp tục mua sắm
                            </Button>
                        </Link>
                    </div>

                    {/* Danh sách đơn hàng */}
                    {isLoading ? (
                        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#C19D56] border-t-transparent rounded-full animate-spin"></div></div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                            <Empty description={<span className="text-gray-400 font-[DM_Sans]">Bạn chưa có đơn hàng nào</span>} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden hover:shadow-md transition-shadow duration-300">

                                    {/* Card Header */}
                                    <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 font-[DM_Sans]">Mã đơn hàng</p>
                                            <p className="font-bold text-[#111111] font-[DM_Sans]">#{order.orderCode}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-[DM_Sans]">Ngày đặt</p>
                                            <p className="font-semibold text-gray-700 font-[DM_Sans]">
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-sm text-gray-500 font-[DM_Sans] mb-1">Trạng thái</p>
                                            {renderOrderStatus(order.orderStatus)}
                                        </div>
                                    </div>

                                    {/* Card Body (Hiển thị 1-2 sản phẩm đại diện) */}
                                    <div className="px-6 py-6">
                                        <div className="flex flex-col gap-4">
                                            {order.items?.slice(0, 2).map((item: any) => (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    <div className="w-20 h-20 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                                                        <img src={item.product?.thumbnail} alt={item.product?.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-[#111111] font-[DM_Sans] text-base line-clamp-1 hover:text-[#C19D56] cursor-pointer transition-colors">
                                                            {item.product?.name}
                                                        </h4>
                                                        <p className="text-gray-500 text-sm font-[DM_Sans] mt-1">Phân loại: Mặc định</p>
                                                        <p className="text-gray-500 text-sm font-[DM_Sans]">x{item.quantity}</p>
                                                    </div>
                                                    <div className="text-right hidden sm:block">
                                                        <p className="font-bold text-[#111111] font-[DM_Sans]">{Number(item.price).toLocaleString('vi-VN')} đ</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {order.items?.length > 2 && (
                                            <div className="mt-4 pt-4 border-t border-gray-50 text-center">
                                                <span className="text-sm text-gray-400 font-[DM_Sans] italic">
                                                    ... và {order.items.length - 2} sản phẩm khác
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Footer */}
                                    <div className="bg-white border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 font-[DM_Sans]">Tổng tiền:</span>
                                            <span className="text-xl font-bold text-[#C19D56] font-[DM_Sans]">
                                                {Number(order.totalAmount).toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                        <div className="flex w-full sm:w-auto gap-3">
                                            <Button
                                                type="primary"
                                                icon={<EyeOutlined />}
                                                onClick={() => showOrderDetails(order)}
                                                className="w-full sm:w-auto bg-[#111111] hover:!bg-[#C19D56] font-[DM_Sans] font-bold h-10 px-6"
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Chi Tiết Đơn Hàng */}
            <Modal
                title={<span className="font-[Marcellus] text-2xl text-[#111111]">Chi tiết đơn hàng #{selectedOrder?.orderCode}</span>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalOpen(false)} className="font-[DM_Sans] font-bold h-10 px-8 border-[#111111] hover:!text-[#C19D56] hover:!border-[#C19D56]">
                        Đóng
                    </Button>
                ]}
                width={700}
                centered
            >
                {selectedOrder && (
                    <div className="mt-6 font-[DM_Sans]">
                        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Ngày đặt hàng</p>
                                <p className="font-bold text-[#111111]">
                                    {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Phương thức thanh toán</p>
                                <p className="font-bold text-[#111111]">{selectedOrder.paymentStatus === 'COMPLETED' ? 'Đã thanh toán (VNPay)' : 'Chưa thanh toán'}</p>
                            </div>
                            <div className="col-span-2 mt-2 pt-4 border-t border-gray-200">
                                <p className="text-gray-500 text-sm mb-1">Thông tin giao nhận</p>
                                <p className="font-bold text-[#111111]">
                                    {selectedOrder.shippingMethod === 'TAKEAWAY' 
                                        ? `Đến lấy tại quán (Dự kiến: ${selectedOrder.pickupTime || 'N/A'})` 
                                        : `Giao hàng tới: ${selectedOrder.streetAddress || ''}`}
                                </p>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-4 text-[#111111] border-b pb-2">Sản phẩm đã mua</h3>
                        <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedOrder.items?.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center bg-white p-3 border border-gray-100 rounded-lg">
                                    <div className="flex gap-4 items-center">
                                        <img src={item.product?.thumbnail} alt={item.product?.name} className="w-16 h-16 object-cover rounded border border-gray-200" />
                                        <div>
                                            <p className="font-bold text-[#111111]">{item.product?.name}</p>
                                            <p className="text-gray-500 text-sm">Số lượng: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-[#C19D56] whitespace-nowrap">
                                        {(item.quantity * Number(item.price)).toLocaleString('vi-VN')} đ
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Divider />

                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-[#111111]">Tổng cộng:</span>
                            <span className="font-bold text-2xl text-[#C19D56]">
                                {Number(selectedOrder.totalAmount).toLocaleString('vi-VN')} đ
                            </span>
                        </div>
                    </div>
                )}
            </Modal>
        </ConfigProvider>
    );
};

export default OrderHistoryComp;