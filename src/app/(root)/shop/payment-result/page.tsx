'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { getCartAPI } from '@/lib/features/cartSlice';
import { useSession } from 'next-auth/react';

const PaymentResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [message, setMessage] = useState('Đang xác nhận giao dịch...');
    const [countdown, setCountdown] = useState(5);
    const { data: session, status: sessionStatus } = useSession();
    const isCalled = useRef(false);

    useEffect(() => {
        // 👇 3. CHỜ NEXT-AUTH LOAD XONG SESSION RỒI MỚI CHẠY API
        if (sessionStatus === 'loading') return;

        const verifyPayment = async () => {
            if (isCalled.current) return;
            isCalled.current = true; // Đánh dấu là đã chạy

            const queryString = searchParams.toString();

            if (!queryString) {
                setStatus('failed');
                setMessage('Không tìm thấy thông tin giao dịch.');
                return;
            }

            try {
                // 👇 4. LẤY TOKEN TỪ SESSION (Tùy cấu hình NextAuth của bạn, thường nằm ở 1 trong 2 vị trí này)
                // Ép kiểu any để tránh lỗi báo đỏ của TypeScript
                const token = (session as any)?.accessToken || (session?.user as any)?.accessToken || (session?.user as any)?.token || '';

                if (!token) {
                    setStatus('failed');
                    setMessage('Lỗi xác thực: Không tìm thấy phiên đăng nhập. Vui lòng đăng nhập lại.');
                    return;
                }

                const response = await fetch(`http://localhost:8386/payment/vnpay-return?${queryString}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}` // 👈 GẮN TOKEN XỊN VÀO ĐÂY
                    }
                });

                const data = await response.json();

                if (data.isSuccess) {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Đơn hàng của bạn đã được ghi nhận.');
                    dispatch(getCartAPI());
                } else {
                    setStatus('failed');
                    setMessage(data.message || 'Giao dịch thất bại.');
                }
            } catch (error) {
                setStatus('failed');
                setMessage('Lỗi kết nối đến máy chủ xác nhận.');
            }
        };

        // Chỉ gọi xác thực khi session đã được NextAuth load xong
        if (sessionStatus === 'authenticated') {
            verifyPayment();
        } else if (sessionStatus === 'unauthenticated') {
            setStatus('failed');
            setMessage('Bạn cần đăng nhập để xem kết quả giao dịch này.');
        }

    }, [searchParams, dispatch, session, sessionStatus]);
    // Xử lý đếm ngược 5s NẾU THÀNH CÔNG
    useEffect(() => {
        if (status === 'success') {
            if (countdown <= 0) {
                router.push('/');
                return;
            }
            const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [countdown, status, router]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-[#fcfcfc] px-4 py-12">
            <div className="bg-white max-w-lg w-full p-8 sm:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center animate-slide-up">

                {status === 'loading' && (
                    <div className="flex flex-col items-center justify-center mb-6">
                        <LoadingOutlined className="text-[72px] text-[#C19D56] mb-4" />
                        <h1 className="text-2xl font-[Marcellus] text-[#111111]">Đang xử lý...</h1>
                    </div>
                )}

                {status === 'success' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <CheckCircleFilled className="text-[72px] text-[#C19D56] animate-bounce-short" />
                        </div>
                        <h1 className="text-3xl font-[Marcellus] text-[#111111] mb-4">Thanh toán thành công!</h1>
                        <p className="text-gray-500 font-[DM_Sans] text-base mb-8">{message}</p>
                        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
                            <p className="text-gray-600 font-[DM_Sans] text-sm">
                                Tự động quay về Trang chủ sau
                                <span className="block text-3xl font-bold text-[#111111] mt-2">{countdown}s</span>
                            </p>
                        </div>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <CloseCircleFilled className="text-[72px] text-red-500" />
                        </div>
                        <h1 className="text-3xl font-[Marcellus] text-[#111111] mb-4">Giao dịch thất bại</h1>
                        <p className="text-gray-500 font-[DM_Sans] text-base mb-8">{message}</p>
                        <Link href="/shop/cart">
                            <button className="w-full bg-[#111111] hover:bg-red-600 text-white font-[DM_Sans] font-bold text-base py-4 rounded-lg transition-colors duration-300 uppercase">
                                Quay lại giỏ hàng
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentResultPage;