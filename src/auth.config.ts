import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { jwtDecode } from "jwt-decode";

export const authConfig = {
  // 👇 1. THÊM DÒNG NÀY: Chìa khóa vạn năng cho Vercel Deployment
  trustHost: true,

  providers: [
    Google({
      // 👇 2. ÉP KIỂU CHUỖI ĐỂ NEXTAUTH KHÔNG BÁO LỖI UNDEFINED
      clientId: process.env.GOOGLE_CLIENT_ID as string || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string || "",
      checks: ['none'],
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
        console.log("👉 [NEXTAUTH] Đang gửi yêu cầu tới:", apiUrl);
        console.log("👉 [NEXTAUTH] Dữ liệu gửi đi:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log("👉 [NEXTAUTH] Mã trạng thái (Status):", res.status);

          // 1. Chỉ đọc text 1 lần duy nhất
          const textData = await res.text();
          console.log("👉 [NEXTAUTH] Dữ liệu thô từ BE:", textData);

          // 2. Chuyển Text thành JSON thủ công để tránh lỗi sập ngầm
          let data;
          try {
            data = JSON.parse(textData);
          } catch (err) {
            console.error("🚨 [NEXTAUTH] Lỗi Parse JSON! Nội dung nhận được:", textData);
            throw new Error("Lỗi máy chủ: Phản hồi không hợp lệ");
          }

          // 3. Xử lý lỗi từ Backend
          if (!res.ok) {
            throw new Error(data?.message || "Đăng nhập thất bại");
          }

          if (data && data.access_token) {
            return {
              ...data.user,
              accessToken: data.access_token,
            };
          }
          return null;
        } catch (error: any) {
          console.error("🚨 Authorize Error:", error.message);
          // BẮT BUỘC PHẢI THROW LỖI ĐỂ FRONTEND NHẬN ĐƯỢC THÔNG BÁO
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === "credentials") {
          token.accessToken = (user as any).accessToken;
          token.role = (user as any).role;
          token.id = (user as any).id;
          const decoded = jwtDecode(user.accessToken as string);
          token.accessTokenExpires = decoded.exp ? decoded.exp * 1000 : 0;
        } else if (account.provider === "google") {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                avatar: user.image,
              }),
            });

            const data = await res.json();

            if (res.ok && data.access_token) {
              token.accessToken = data.access_token;
              token.role = data.user.role;
              token.id = data.user.id;
              const decoded = jwtDecode(data.access_token);
              token.accessTokenExpires = decoded.exp ? decoded.exp * 1000 : 0;
            } else {
              console.error("Lỗi đồng bộ Google auth với BE:", data);
            }
          } catch (error) {
            console.error("Lỗi gọi API /auth/google:", error);
          }
        }
      }
      if (token.accessTokenExpires) {
        if (Date.now() >= (token.accessTokenExpires as number)) {
          token.isExpired = true; // Đánh dấu là đã hết hạn!
        } else {
          token.isExpired = false;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        (session as any).accessToken = token.accessToken as string;
        (session as any).isExpired = token.isExpired;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;