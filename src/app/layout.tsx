import './globals.scss'
import { DM_Sans } from "next/font/google";
import { Marcellus } from "next/font/google";


const dmSans = DM_Sans({
  subsets: ["latin"],        // bộ ký tự
  weight: ["400", "500", "700"], // độ đậm muốn dùng
  variable: "--font-dm-sans"     // khai báo biến CSS để Tailwind nhận
});

const marcellus = Marcellus({
  weight: "400", // Marcellus chỉ có 1 weight
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
      <body className={`${dmSans.variable} ${marcellus.variable}`}>{children}</body>
    </html>
  )
}