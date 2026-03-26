'use client';

import React, { useState } from 'react';
import { Button, Card, message, Tag, Input } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useCheckInMutation, useCheckOutMutation, useGetTodayScheduleQuery } from '@/services/attendanceApi';

const AttendanceWidget = () => {
    const { data: session } = useSession();
    const [note, setNote] = useState('');

    const { data: schedule, isLoading } = useGetTodayScheduleQuery(undefined, {
        skip: !session, 
    });

    const [checkInAPI, { isLoading: isCheckingIn }] = useCheckInMutation();
    const [checkOutAPI, { isLoading: isCheckingOut }] = useCheckOutMutation();

    // 👇 LOGIC MỚI: Dùng trực tiếp trạng thái từ bảng WorkSchedule
    const currentStatus = schedule?.attendanceStatus || 'NOT_STARTED';

    const handleAction = async (action: 'check-in' | 'check-out') => {
        try {
            if (action === 'check-in') {
                const res = await checkInAPI({ note }).unwrap();
                message.success(res.message);
            } else {
                const res = await checkOutAPI({ note }).unwrap();
                message.success(res.message);
            }
            setNote('');
        } catch (error: any) {
            message.error(error?.data?.message || `Lỗi thực hiện ${action}`);
        }
    };

    if (isLoading) return <Card loading={true} className="w-80 shadow-sm" />;

    return (
        <Card className="w-80 shadow-sm border-gray-200" title={<span className="font-bold">⏰ Chấm công hôm nay</span>}>
            {!schedule ? (
                <div className="text-center text-gray-500 py-4">
                    <p>Hôm nay bạn không có ca làm việc.</p>
                    <p>Nghỉ ngơi thật tốt nhé! ☕</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Thời gian ca làm:</p>
                        <p className="font-bold text-lg">
                            {new Date(schedule.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} 
                            {' - '} 
                            {new Date(schedule.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>

                    {currentStatus !== 'CHECKED_OUT' && (
                        <div className="w-full">
                            <Input.TextArea 
                                placeholder="Thêm ghi chú (Đi trễ do kẹt xe, làm thêm giờ...)" 
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={2}
                                className="w-full text-sm"
                            />
                        </div>
                    )}

                    {currentStatus === 'NOT_STARTED' && (
                        <Button 
                            type="primary" size="large" icon={<ClockCircleOutlined />} 
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleAction('check-in')}
                            loading={isCheckingIn} 
                        >
                            Vào ca (Check-in)
                        </Button>
                    )}

                    {currentStatus === 'CHECKED_IN' && (
                        <>
                            <Tag color="processing" className="mb-0">Đang trong ca làm</Tag>
                            <Button 
                                type="primary" danger size="large" icon={<LogoutOutlined />} 
                                className="w-full"
                                onClick={() => handleAction('check-out')}
                                loading={isCheckingOut} 
                            >
                                Tan ca (Check-out)
                            </Button>
                        </>
                    )}

                    {currentStatus === 'CHECKED_OUT' && (
                        <div className="flex flex-col items-center gap-2 text-green-600 py-4">
                            <CheckCircleOutlined className="text-4xl" />
                            <p className="font-bold">Đã hoàn thành ca làm!</p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default AttendanceWidget;