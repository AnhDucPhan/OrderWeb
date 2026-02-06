// app/(root)/layout.tsx
import React from 'react';
import Header from '@/components/componentsRoot/componentHomePage/header';
import Footer from '@/components/componentsRoot/componentHomePage/footer';
import ButtonCart from '@/components/componentsRoot/ui/btnCart';

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