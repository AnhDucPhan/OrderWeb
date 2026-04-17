// src/components/Providers.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import StoreProvider from "@/lib/StoreProvider"; // Import file Redux cũ của bạn vào đây
import SessionGuard from "./auth/SessionGuard";
import { App as AntdApp } from 'antd';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 1. Lớp Auth bao ngoài cùng
    <SessionProvider refetchInterval={10}>

      {/* 2. Lớp Redux bao bên trong */}
      <StoreProvider>
          {/* 3. Nội dung trang web */}
          <SessionGuard>
            {/* Các component khác của bạn */}
            {children}
          </SessionGuard>
      </StoreProvider>

    </SessionProvider>
  );
}