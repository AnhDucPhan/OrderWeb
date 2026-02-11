// app/(root)/layout.tsx
import React from 'react';

import ButtonCart from '@/components/componentsRoot/uiRoot/btnCart';
import Header from '@/components/componentsRoot/uiRoot/header';
import Footer from '@/components/componentsRoot/uiRoot/footer';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <>
            <Header />
            <ButtonCart />
            <main className='flex-grow'>
                {children}
            </main>
            {/* Footer chỉ hiện cho khách mua hàng */}
            <Footer />
        </>
    );
}