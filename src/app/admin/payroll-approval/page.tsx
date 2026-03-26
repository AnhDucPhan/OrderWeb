'use client';

import React, { useState } from 'react';
import { 
    Table, Card, Tag, Button, DatePicker, Input, Tooltip, 
    Space, message, Popconfirm, Modal, InputNumber, Divider, TimePicker 
} from 'antd';
import { 
    CheckOutlined, CloseOutlined, MessageOutlined, 
    WarningOutlined, SearchOutlined, EditOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useGetPayrollSchedulesQuery, useReviewPayrollMutation } from '@/services/payrollApi';

// 👇 1. ĐÃ ĐỔI VỀ PAYROLL API 👇

// Khởi tạo plugin cho dayjs để xử lý định dạng HH:mm
dayjs.extend(customParseFormat);

const PayrollApprovalPage = () => {
    // --- STATE TÌM KIẾM & LỌC ---
    const [filterStatus, setFilterStatus] = useState('NEEDS_REVIEW');
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().startOf('week').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('week').format('YYYY-MM-DD'),
    });

    // 👇 2. SỬ DỤNG ĐÚNG HOOK CỦA PAYROLL 👇
    const { data: schedules = [], isLoading } = useGetPayrollSchedulesQuery(dateRange);
    const [reviewAPI, { isLoading: isReviewing }] = useReviewPayrollMutation();

    // --- STATE CHO MODAL DUYỆT CÔNG NÂNG CAO ---
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [timeRange, setTimeRange] = useState<any>([null, null]);
    const [breakMinutes, setBreakMinutes] = useState<number>(60);
    const [editStandardMins, setEditStandardMins] = useState<number>(0);
    const [editOtMins, setEditOtMins] = useState<number>(0);

    // --- CÁC HÀM XỬ LÝ LOGIC ---

    const handleWeekChange = (date: any) => {
        if (date) {
            setDateRange({
                startDate: date.startOf('week').format('YYYY-MM-DD'),
                endDate: date.endOf('week').format('YYYY-MM-DD'),
            });
        }
    };

    const calculateMinutes = (start: any, end: any, breakMins: number) => {
        if (!start || !end) {
            setEditStandardMins(0);
            setEditOtMins(0);
            return;
        }
        let diffMins = end.diff(start, 'minute');
        if (diffMins < 0) diffMins += 24 * 60; 
        const totalWorkMins = Math.max(0, diffMins - breakMins);

        if (totalWorkMins >= 480) {
            setEditStandardMins(480);
            setEditOtMins(totalWorkMins - 480);
        } else {
            setEditStandardMins(totalWorkMins);
            setEditOtMins(0);
        }
    };

    const openApproveModal = (record: any) => {
        setSelectedRecord(record);
        const inTimeStr = record.actualTime.in !== '--:--' ? record.actualTime.in : record.planTime.split(' - ')[0];
        const outTimeStr = record.actualTime.out !== '--:--' ? record.actualTime.out : record.planTime.split(' - ')[1];
        
        const startDjs = dayjs(inTimeStr, 'HH:mm');
        const endDjs = dayjs(outTimeStr, 'HH:mm');
        
        setTimeRange([startDjs, endDjs]);
        setBreakMinutes(60);
        calculateMinutes(startDjs, endDjs, 60);
        setIsModalVisible(true);
    };

    const handleTimeChange = (dates: any) => {
        setTimeRange(dates);
        if (dates && dates[0] && dates[1]) {
            calculateMinutes(dates[0], dates[1], breakMinutes);
        }
    };

    const handleBreakChange = (val: number | null) => {
        const breakM = val || 0;
        setBreakMinutes(breakM);
        calculateMinutes(timeRange[0], timeRange[1], breakM);
    };

    const handleApproveSubmit = async () => {
        try {
            const res = await reviewAPI({
                id: selectedRecord.id, // Về lại id thay vì scheduleId
                decision: 'APPROVE',
                standardMinutes: editStandardMins,
                otMinutes: editOtMins
            }).unwrap();

            message.success(res?.message || 'Đã duyệt công thành công!');
            setIsModalVisible(false);
            setSelectedRecord(null);
        } catch (error: any) {
            message.error(error?.data?.message || 'Lỗi khi duyệt công');
        }
    };

    const handleReject = async (id: number) => {
        try {
            const res = await reviewAPI({
                id: id, // Về lại id
                decision: 'REJECT', 
                standardMinutes: 0, 
                otMinutes: 0
            }).unwrap();
            message.success(res?.message || 'Đã từ chối tính công!');
        } catch (error: any) {
            message.error(error?.data?.message || 'Lỗi khi từ chối');
        }
    };

    // --- KPI & LỌC DỮ LIỆU CƠ BẢN ---
    const total = schedules.length;
    const autoApproved = schedules.filter((s: any) => s.systemFlag === 'AUTO_APPROVED').length;
    const needsReview = schedules.filter((s: any) => s.systemFlag === 'NEEDS_REVIEW').length;
    const resolved = schedules.filter((s: any) => s.payrollStatus === 'MANUALLY_APPROVED' || s.payrollStatus === 'REJECTED').length;

    let filteredData = filterStatus === 'NEEDS_REVIEW' ? schedules.filter((s: any) => s.systemFlag === 'NEEDS_REVIEW') : schedules;
    if (searchText) {
        filteredData = filteredData.filter((s: any) => s.employee.name.toLowerCase().includes(searchText.toLowerCase()));
    }

    // NHÓM DỮ LIỆU THEO NGÀY (GROUP BY DATE)
    const groupedObj = filteredData.reduce((acc: any, curr: any) => {
        const dateStr = dayjs(curr.shiftDate).format('DD/MM/YYYY');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(curr);
        return acc;
    }, {});

    // Chuyển object đã nhóm thành cấu trúc mảng Tree Data cho Ant Design
    const treeData = Object.entries(groupedObj).map(([dateStr, items]: [string, any]) => {
        const errorCount = items.filter((i: any) => i.systemFlag === 'NEEDS_REVIEW').length;
        return {
            id: `group-${dateStr}`, 
            isGroup: true, 
            dateStr,
            errorCount,
            children: items, 
        };
    });

    // --- CẤU HÌNH CỘT CHO BẢNG ---
    const columns = [
        {
            title: 'Nhân viên / Ngày làm việc',
            dataIndex: 'employee',
            key: 'employee',
            render: (emp: any, record: any) => {
                if (record.isGroup) {
                    return (
                        <div className="font-bold text-blue-700 text-base py-1">
                             Ngày {record.dateStr}
                            {record.errorCount > 0 ? (
                                <Tag color="warning" className="ml-3 font-normal">{record.errorCount} ca cần duyệt</Tag>
                            ) : (
                                <Tag color="success" className="ml-3 font-normal">Đã duyệt xong</Tag>
                            )}
                        </div>
                    );
                }
                return (
                    <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full border border-gray-200" />
                        <div>
                            <p className="font-bold text-gray-800">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.code}</p>
                        </div>
                    </div>
                );
            },
            onCell: (record: any) => ({ colSpan: record.isGroup ? 6 : 1 })
        },
        {
            title: 'Giờ đăng ký',
            key: 'plan',
            render: (_: any, record: any) => {
                if (record.isGroup) return null; 
                return (
                    <div>
                        <p className="text-gray-800 font-medium">{record.planTime}</p>
                    </div>
                );
            },
            onCell: (record: any) => ({ colSpan: record.isGroup ? 0 : 1 })
        },
        {
            title: 'Thực tế (In - Out)',
            key: 'actual',
            render: (_: any, record: any) => {
                if (record.isGroup) return null; 
                return (
                    <div className="flex flex-col gap-1 text-sm">
                        <span className={record.lateMinutes > 0 ? 'text-red-500 font-bold' : 'text-green-600'}>
                            In: {record.actualTime?.in} {record.lateMinutes > 0 && `(Trễ ${record.lateMinutes}p)`}
                        </span>
                        <span className={record.otMinutes > 0 ? 'text-blue-600 font-bold' : 'text-gray-600'}>
                            Out: {record.actualTime?.out} {record.otMinutes > 0 && `(OT ${record.otMinutes}p)`}
                        </span>
                    </div>
                );
            },
            onCell: (record: any) => ({ colSpan: record.isGroup ? 0 : 1 })
        },
        {
            title: 'Ghi chú',
            key: 'notes',
            render: (_: any, record: any) => {
                if (record.isGroup) return null; 
                const hasNote = record.notes?.in || record.notes?.out;
                if (!hasNote) return <span className="text-gray-300 italic">Không</span>;
                return (
                    <Tooltip title={
                        <div>
                            {record.notes.in && <p><b>Vào:</b> {record.notes.in}</p>}
                            {record.notes.out && <p><b>Ra:</b> {record.notes.out}</p>}
                        </div>
                    }>
                        <Tag icon={<MessageOutlined />} color="processing" className="cursor-pointer">Xem</Tag>
                    </Tooltip>
                );
            },
            onCell: (record: any) => ({ colSpan: record.isGroup ? 0 : 1 })
        },
        {
            title: 'Hệ thống đánh giá',
            dataIndex: 'systemFlag',
            key: 'systemFlag',
            render: (flag: string, record: any) => {
                if (record.isGroup) return null; 
                if (flag === 'AUTO_APPROVED') return <Tag color="success">Hợp lệ</Tag>;
                if (flag === 'NEEDS_REVIEW') return <Tag color="warning" icon={<WarningOutlined />}>Cần xem xét</Tag>;
                return <Tag>{flag}</Tag>;
            },
            onCell: (record: any) => ({ colSpan: record.isGroup ? 0 : 1 })
        },
        {
            title: 'Quyết định',
            key: 'action',
            render: (_: any, record: any) => {
                if (record.isGroup) return null; 
                
                if (record.payrollStatus === 'AUTO_APPROVED' || record.payrollStatus === 'MANUALLY_APPROVED') {
                    return <span className="text-green-600 font-medium"><CheckOutlined /> Đã chốt</span>;
                }
                if (record.payrollStatus === 'REJECTED') {
                    return <span className="text-red-500 font-medium"><CloseOutlined /> Đã phạt</span>;
                }

                return (
                    <Space>
                        <Button type="primary" className="bg-green-600 hover:bg-green-700" size="small" icon={<EditOutlined />} onClick={() => openApproveModal(record)}>
                            Duyệt
                        </Button>
                        <Popconfirm title="Xác nhận phạt?" onConfirm={() => handleReject(record.id)}>
                            <Button danger size="small" disabled={isReviewing}>Từ chối</Button>
                        </Popconfirm>
                    </Space>
                );
            },
            onCell: (record: any) => ({ colSpan: record.isGroup ? 0 : 1 })
        }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Duyệt Công Nhân Viên</h1>
                    <p className="text-gray-500">Quản lý và chốt công theo tuần</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="font-medium text-gray-600">Chọn tuần:</span>
                    <DatePicker picker="week" defaultValue={dayjs()} format="[Tuần] w - YYYY" onChange={handleWeekChange} allowClear={false} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="shadow-sm border-l-4 border-l-blue-500 py-2"><p className="text-gray-500 text-sm">Tổng ca làm</p><h3 className="text-2xl font-bold">{total}</h3></Card>
                <Card className="shadow-sm border-l-4 border-l-green-500 py-2"><p className="text-gray-500 text-sm">Hợp lệ (Máy duyệt)</p><h3 className="text-2xl font-bold text-green-600">{autoApproved}</h3></Card>
                <Card className="shadow-sm border-l-4 border-l-orange-500 bg-orange-50 py-2"><p className="text-orange-600 font-medium text-sm">Ngoại lệ (Cần duyệt)</p><h3 className="text-2xl font-bold text-orange-600">{needsReview}</h3></Card>
                <Card className="shadow-sm border-l-4 border-l-gray-800 py-2"><p className="text-gray-500 text-sm">Đã chốt công</p><h3 className="text-2xl font-bold">{resolved} / {needsReview}</h3></Card>
            </div>

            <Card className="shadow-sm rounded-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <div className="flex gap-2">
                        <Button type={filterStatus === 'NEEDS_REVIEW' ? 'primary' : 'default'} onClick={() => setFilterStatus('NEEDS_REVIEW')} className={filterStatus === 'NEEDS_REVIEW' ? 'bg-orange-500 hover:bg-orange-600 border-none' : ''}>Cần duyệt ({needsReview})</Button>
                        <Button type={filterStatus === 'ALL' ? 'primary' : 'default'} onClick={() => setFilterStatus('ALL')}>Tất cả ({total})</Button>
                    </div>
                    <Input placeholder="Tìm tên nhân viên..." prefix={<SearchOutlined className="text-gray-400" />} className="w-full sm:w-64" value={searchText} onChange={e => setSearchText(e.target.value)} allowClear />
                </div>

                <Table 
                    columns={columns} 
                    dataSource={treeData} 
                    rowKey="id" 
                    loading={isLoading} 
                    pagination={{ pageSize: 20 }}
                    defaultExpandAllRows={true} 
                />
            </Card>

            <Modal title={<span className="text-lg font-bold">Chốt thời gian làm việc</span>} open={isModalVisible} onOk={handleApproveSubmit} onCancel={() => setIsModalVisible(false)} confirmLoading={isReviewing} okText="Chốt công" cancelText="Hủy" okButtonProps={{ className: 'bg-green-600 hover:bg-green-700' }} width={500}>
                {selectedRecord && (
                    <div className="py-2">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-5 text-sm">
                            <p><strong>Nhân viên:</strong> {selectedRecord.employee.name} ({selectedRecord.employee.code})</p>
                            <p><strong>Kế hoạch gốc:</strong> {selectedRecord.planTime}</p>
                            <p>
                                <strong>Thực tế bấm vân tay:</strong>{' '}
                                <span className={selectedRecord.lateMinutes > 0 ? 'text-red-500 font-bold' : ''}>{selectedRecord.actualTime.in}</span> {' - '} <span className={selectedRecord.otMinutes > 0 ? 'text-blue-600 font-bold' : ''}>{selectedRecord.actualTime.out}</span>
                            </p>
                        </div>
                        <div className="mb-4">
                            <p className="font-bold text-gray-700 mb-1">Khung giờ duyệt công trả lương</p>
                            <p className="text-xs text-gray-500 mb-2">Hệ thống gợi ý dựa trên giờ thực tế. Bạn có thể sửa đổi nếu muốn.</p>
                            <TimePicker.RangePicker format="HH:mm" value={timeRange} onChange={handleTimeChange} className="w-full" size="large" allowClear={false} />
                        </div>
                        <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg">
                            <div><p className="font-bold text-gray-700">Trừ giờ nghỉ giữa ca</p></div>
                            <InputNumber min={0} value={breakMinutes} onChange={handleBreakChange} addonAfter="phút" className="w-32" />
                        </div>
                        <Divider className="my-2" />
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Giờ hành chính duyệt:</span>
                            <span className="font-bold text-lg text-green-600">{editStandardMins} phút</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-gray-500">Tăng ca (OT) duyệt:</span>
                            <span className="font-bold text-lg text-orange-500">{editOtMins} phút</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PayrollApprovalPage;