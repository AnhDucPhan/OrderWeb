// app/(root)/layout.tsx
import React from 'react';

import ButtonCart from '@/components/componentsRoot/uiRoot/btnCart';
import Header from '@/components/componentsRoot/uiRoot/header';
import Footer from '@/components/componentsRoot/uiRoot/footer';

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode,
    
}) {
    return (
        // 👇 Thay <> bằng thẻ div flex này
        <div className="flex flex-col min-h-screen relative">
            <Header />
            <ButtonCart />
            
            {/* Thẻ main bây giờ đã có thể co giãn thoải mái */}
            <main className='flex-grow flex flex-col'>
                {children}
            </main>

            {/* Footer chỉ hiện cho khách mua hàng */}
            <Footer />
        </div>
    );
}