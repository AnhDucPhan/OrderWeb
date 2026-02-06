// app/(root)/layout.tsx
import React from 'react';
import Header from '@/components/componentHomePage/header';
import Footer from '@/components/componentHomePage/footer';
import ButtonCart from '@/components/ui/btnCart';

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