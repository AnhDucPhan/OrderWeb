'use client';

import React from 'react';
import Link from 'next/link';
import { ConfigProvider, InputNumber, Button, Divider, Input } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
// Nhớ import các action từ slice của bạn (ví dụ updateQuantity, removeItem...)
// import { updateQuantity, removeItem } from '@/lib/features/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  // Lấy data từ Redux
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  // Tính tổng tiền
  const subTotal = cartItems.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const shippingFee = 30000; // Giả lập phí ship
  const total = subTotal + shippingFee;

  // Xử lý thay đổi số lượng (Placeholder)
  const handleQuantityChange = (id: number, value: number | null) => {
    console.log('Update quantity:', id, value);
    // dispatch(updateQuantity({ id, quantity: value }));
  };

  // Xử lý xóa (Placeholder)
  const handleRemove = (id: number) => {
    console.log('Remove item:', id);
    // dispatch(removeItem(id));
  };

  // --- GIAO DIỆN KHI GIỎ TRỐNG ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 bg-white px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-[#C19D56]">
           <ShoppingCartOutlined style={{ fontSize: '48px' }} />
        </div>
        <h2 className="text-2xl font-[Marcellus] text-[#111111]">Your cart is currently empty.</h2>
        <Link href="/products">
          <button className="bg-[#111111] text-white px-8 py-3 rounded hover:bg-[#C19D56] transition-all duration-300 font-[DM_Sans] font-bold uppercase tracking-wider">
            Return to Shop
          </button>
        </Link>
      </div>
    );
  }

  // --- GIAO DIỆN CHÍNH ---
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
      <div className="bg-[#fcfcfc] min-h-screen py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-24">
          
          {/* Breadcrumb / Title */}
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-[Marcellus] text-[#111111] mb-2">Shopping Cart</h1>
            <p className="text-gray-500 font-[DM_Sans]">
              <Link href="/" className="hover:text-[#C19D56]">Home</Link> / Cart
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
            <div className="w-full lg:basis-2/3">
              {/* Header của bảng (Ẩn trên mobile) */}
              <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 text-sm font-bold text-gray-400 uppercase tracking-wider font-[DM_Sans]">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* List Items */}
              <div className="flex flex-col gap-6 mt-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="group relative bg-white border border-gray-100 p-4 rounded-lg sm:border-0 sm:bg-transparent sm:p-0 sm:rounded-none flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center shadow-sm sm:shadow-none">
                    
                    {/* 1. Product Info */}
                    <div className="col-span-6 flex gap-4 w-full items-center">
                      {/* Nút xóa (Mobile thì hiện góc phải, PC hiện bên trái ảnh) */}
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="absolute top-4 right-4 sm:static text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <DeleteOutlined />
                      </button>
                      
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 flex-shrink-0 overflow-hidden rounded border border-gray-200">
                        <img 
                          src={item.product.thumbnail || '/images/placeholder.png'} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-col">
                         <Link href={`/products/${item.product.id}`} className="text-[#111111] font-[DM_Sans] font-bold text-lg hover:text-[#C19D56] transition line-clamp-1">
                            {item.product.name}
                         </Link>
                         <span className="text-sm text-gray-400 mt-1">Size: Regular</span> {/* Ví dụ biến thể */}
                      </div>
                    </div>

                    {/* 2. Price (Mobile: Ẩn hoặc hiển thị kiểu khác) */}
                    <div className="col-span-2 text-center hidden sm:block font-[DM_Sans] text-gray-600">
                      {Number(item.product.price).toLocaleString('vi-VN')} đ
                    </div>

                    {/* 3. Quantity */}
                    <div className="col-span-2 flex justify-between sm:justify-center items-center w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-0 pt-4 sm:pt-0 border-gray-100">
                      <span className="sm:hidden text-gray-500 font-medium">Quantity:</span>
                      <div className="custom-input-number">
                        {/* Custom InputNumber của Antd hoặc HTML input thường */}
                        <InputNumber 
                           min={1} 
                           max={99} 
                           defaultValue={item.quantity} 
                           onChange={(val) => handleQuantityChange(item.id, val)}
                           className="w-16"
                        />
                      </div>
                    </div>

                    {/* 4. Subtotal */}
                    <div className="col-span-2 text-right w-full sm:w-auto flex justify-between sm:block mt-2 sm:mt-0">
                       <span className="sm:hidden text-gray-500 font-medium">Total:</span>
                       <span className="text-[#C19D56] font-bold font-[DM_Sans]">
                          {(Number(item.product.price) * item.quantity).toLocaleString('vi-VN')} đ
                       </span>
                    </div>

                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                 <Link href="/products" className="flex items-center gap-2 text-[#111111] font-bold hover:text-[#C19D56] transition">
                    <ArrowLeftOutlined /> Continue Shopping
                 </Link>
                 <button className="text-gray-400 hover:text-[#111111] font-[DM_Sans] text-sm underline">
                    Clear Shopping Cart
                 </button>
              </div>
            </div>

            {/* --- CỘT PHẢI: ORDER SUMMARY --- */}
            <div className="w-full lg:basis-1/3">
              <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm sticky top-24">
                <h3 className="text-xl font-[Marcellus] text-[#111111] mb-6 border-b border-gray-100 pb-4">
                  Cart Totals
                </h3>

                {/* Subtotal */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-[DM_Sans]">Subtotal</span>
                  <span className="text-[#111111] font-bold font-[DM_Sans]">
                    {subTotal.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-[DM_Sans]">Shipping</span>
                  <div className="text-right">
                     <span className="text-[#111111] font-[DM_Sans] block">Flat Rate: {shippingFee.toLocaleString()} đ</span>
                     <span className="text-xs text-gray-400">Shipping to Vietnam</span>
                  </div>
                </div>

                {/* Coupon (Optional) */}
                <div className="my-6">
                    <p className="text-sm text-gray-500 mb-2">Have a coupon?</p>
                    <div className="flex gap-2">
                        <Input placeholder="Coupon code" className="font-[DM_Sans]" />
                        <Button type="default" className="border-[#111111] text-[#111111] hover:!border-[#C19D56] hover:!text-[#C19D56]">
                            Apply
                        </Button>
                    </div>
                </div>

                <Divider />

                {/* Total */}
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-[#111111] font-[Marcellus]">Total</span>
                  <span className="text-2xl font-bold text-[#C19D56] font-[DM_Sans]">
                    {total.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {/* Checkout Button */}
                <Button 
                    type="primary" 
                    block 
                    size="large" 
                    className="h-14 text-base font-bold bg-[#111111] hover:!bg-[#C19D56] uppercase tracking-widest"
                >
                    Proceed to Checkout
                </Button>

                {/* Trust Badges (Optional) */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400 mb-2">Guaranteed Safe Checkout</p>
                    <div className="flex justify-center gap-2 opacity-60 grayscale hover:grayscale-0 transition">
                       {/* Chèn icon Visa/Mastercard giả lập */}
                       <div className="w-8 h-5 bg-gray-200 rounded"></div>
                       <div className="w-8 h-5 bg-gray-200 rounded"></div>
                       <div className="w-8 h-5 bg-gray-200 rounded"></div>
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