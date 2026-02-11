// app/layout.tsx
import './globals.css'
import { DM_Sans, Marcellus } from "next/font/google";
import "antd/dist/reset.css";
import Providers from '@/components/Providers'; // Giữ lại Provider nếu Admin cũng cần Redux/Auth
import { Toaster } from "@/components/ui/sonner" //
import StoreProvider from '@/lib/StoreProvider';

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

export const metadata = {
  title: 'My Shop',
  description: 'E-commerce Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${marcellus.variable} flex flex-col min-h-screen`}>
        <Providers>
          {/* Ở đây KHÔNG CÒN Header hay Footer nữa.
              Nó chỉ render children (có thể là layout con của user hoặc layout con của admin)
            */}
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}