// app/layout.tsx
import Header from '@/components/componentHomePage/header';
import Footer from '@/components/componentHomePage/footer';
import './globals.scss'
import { DM_Sans, Marcellus } from "next/font/google";
import "antd/dist/reset.css";
import StoreProvider from '@/lib/StoreProvider';
import Providers from '@/components/Providers';

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans"
});

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">

      <body className={`${dmSans.variable} ${marcellus.variable} flex flex-col min-h-screen`}>
        <Providers>
          <Header />
          <main className='flex-grow'>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}