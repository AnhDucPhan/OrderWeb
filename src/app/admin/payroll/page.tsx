'use client';

import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { 
    Calculator, CheckCircle2, DollarSign, 
    Download, Eye, Search, WalletCards, Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useGetMonthlySalaryQuery, usePaySalaryMutation } from '@/services/salaryApi';

const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function PayrollPage() {
    const [monthValue, setMonthValue] = useState(dayjs().format('YYYY-MM'));
    const [searchText, setSearchText] = useState('');

    const { data: payrollData = [], isLoading } = useGetMonthlySalaryQuery(monthValue);
    const [paySalaryAPI, { isLoading: isProcessing }] = usePaySalaryMutation();

    // --- FRONTEND CHỈ CÒN NHIỆM VỤ LỌC TÌM KIẾM ---
    const processedData = useMemo(() => {
        if (!payrollData || payrollData.length === 0) return [];

        if (searchText) {
            return payrollData.filter((d: any) => 
                d.employee.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        return payrollData; // Dữ liệu BE trả về sao thì giữ nguyên vậy
    }, [payrollData, searchText]);

    // KPI Thống kê
    const totalEmployees = processedData.length;
    const unpaidCount = processedData.filter((d: any) => !d.isPaid).length;
    const totalEstimatedPay = processedData.reduce((sum: number, item: any) => sum + item.totalSalary, 0);

    const handlePaySingle = async (userId: number) => {
        try {
            const res = await paySalaryAPI({ userId, month: monthValue }).unwrap();
            toast.success(res.message || 'Đã thanh toán lương cho nhân viên!');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Lỗi khi thanh toán lương!');
        }
    };

    const handlePayAll = async () => {
        const unpaidUsers = processedData.filter((d: any) => !d.isPaid);
        if (unpaidUsers.length === 0) return;

        try {
            await Promise.all(
                unpaidUsers.map((user: any) => paySalaryAPI({ userId: user.userId, month: monthValue }).unwrap())
            );
            toast.success(`Đã thanh toán đồng loạt cho ${unpaidUsers.length} nhân viên!`);
        } catch (error: any) {
            toast.error('Có lỗi xảy ra trong quá trình thanh toán hàng loạt!');
        }
    };

    return (
        <TooltipProvider>
            <div className="p-6 bg-slate-50 min-h-screen space-y-6">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <WalletCards className="w-6 h-6 text-blue-600" />
                            Chốt Lương & Thanh Toán
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Tổng hợp công và xuất phiếu lương hàng tháng</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 px-3 rounded-lg shadow-sm border border-slate-200">
                        <span className="font-medium text-slate-600 text-sm">Tháng chốt công:</span>
                        <Input 
                            type="month" 
                            value={monthValue} 
                            onChange={(e) => setMonthValue(e.target.value)} 
                            className="w-40 h-8 font-medium" 
                        />
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Tổng nhân sự có công</CardTitle>
                            <Calculator className="w-4 h-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-800">{totalEmployees}</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Dự toán quỹ lương</CardTitle>
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">{formatVND(totalEstimatedPay)}</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm bg-blue-50/50 border-blue-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700">Phiếu lương chờ thanh toán</CardTitle>
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{unpaidCount}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* MAIN TABLE */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Tìm tên nhân viên..." 
                                    className="pl-9" 
                                    value={searchText} 
                                    onChange={e => setSearchText(e.target.value)} 
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="border-slate-300">
                                    <Download className="w-4 h-4 mr-2" /> Xuất Excel
                                </Button>
                                <Button 
                                    onClick={handlePayAll} 
                                    disabled={unpaidCount === 0 || isProcessing || isLoading}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Thanh toán tất cả ({unpaidCount})
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Nhân viên</TableHead>
                                        <TableHead className="text-center">Số ca</TableHead>
                                        <TableHead className="text-right">Tổng giờ công</TableHead>
                                        <TableHead className="text-right">Mức lương</TableHead>
                                        <TableHead className="text-right font-bold text-slate-800">Thành tiền</TableHead>
                                        <TableHead className="text-center">Trạng thái</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10">
                                                <Loader2 className="animate-spin h-6 w-6 mx-auto text-blue-500" />
                                                <p className="text-slate-500 mt-2 text-sm">Đang tải bảng lương...</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : processedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                                                Không có dữ liệu công tháng này
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        processedData.map((row: any) => (
                                            <TableRow key={row.userId} className="hover:bg-slate-50/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img src={row.employee.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-200" />
                                                        <div>
                                                            <p className="font-semibold text-slate-800">{row.employee.name}</p>
                                                            <p className="text-xs text-slate-500">{row.employee.position} • {row.employee.code}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell className="text-center font-medium">{row.totalShifts}</TableCell>
                                                
                                                <TableCell className="text-right">
                                                    <span className="font-semibold text-emerald-600">
                                                        {/* Lấy thẳng data từ Backend xuống */}
                                                        {row.totalHours?.toFixed(1)} giờ
                                                    </span>
                                                </TableCell>
                                                
                                                <TableCell className="text-right text-sm">
                                                    <p className="font-medium text-slate-700">{formatVND(row.hourlyRate)}/h</p>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <span className="text-lg font-bold text-slate-800">
                                                        {formatVND(row.totalSalary)}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    {row.isPaid ? (
                                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Đã thanh toán</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Chờ thanh toán</Badge>
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Xem chi tiết từng ca</TooltipContent>
                                                        </Tooltip>
                                                        
                                                        {!row.isPaid && (
                                                            <Button 
                                                                size="sm" 
                                                                disabled={isProcessing}
                                                                onClick={() => handlePaySingle(row.userId)} 
                                                                className="h-8 bg-slate-800 hover:bg-slate-700 text-white"
                                                            >
                                                                Chốt lương
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
}