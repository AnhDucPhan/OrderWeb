import './globals.scss'
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],        // bộ ký tự
  weight: ["400", "500", "700"], // độ đậm muốn dùng
  variable: "--font-dm-sans"     // khai báo biến CSS để Tailwind nhận
});

export default function RootLayout({
  children,

}: {
  children: React.ReactNode,

}) {
  return (
    <html lang="en">
      <body className={dmSans.variable}>{children}</body>
    </html>
  )
}