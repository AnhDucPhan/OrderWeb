// src/components/Providers.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import StoreProvider from "@/lib/StoreProvider"; // Import file Redux cũ của bạn vào đây

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 1. Lớp Auth bao ngoài cùng
    <SessionProvider>
      
      {/* 2. Lớp Redux bao bên trong */}
      <StoreProvider>
        
        {/* 3. Nội dung trang web */}
        {children}

      </StoreProvider>

    </SessionProvider>
  );
}