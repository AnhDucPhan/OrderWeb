// auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
        if (!credentials?.email || !credentials?.password) return null;

        try {
          console.log("Calling API:", `${process.env.NEXT_PUBLIC_API_URL}/auth/login`);

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          console.log("Backend Response:", { status: res.status, data });

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

        } catch (error) {
          console.error("Authorize Error:", error);
          return null; 
        }
      },
    }),
  ],
  callbacks: {
    // 👇 THÊM MỚI: Bổ sung tham số account để phân biệt Google hay Credentials
    async jwt({ token, user, account }) {
      
      // Chỉ chạy ở lần đăng nhập đầu tiên (khi có dữ liệu user và account)
      if (account && user) {
        
        // 1. Nếu là đăng nhập bằng Tài khoản/Mật khẩu cũ
        if (account.provider === "credentials") {
          token.accessToken = (user as any).accessToken;
          token.role = (user as any).role;
          token.id = (user as any).id;
        } 
        
        // 👇 THÊM MỚI: 2. Nếu là đăng nhập bằng Google
        else if (account.provider === "google") {
          try {
            // Gửi thông tin Google cấp xuống Backend NestJS để đối chiếu/tạo mới
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
              // Gắn token nội bộ của Backend vào NextAuth session
              token.accessToken = data.access_token;
              token.role = data.user.role;
              token.id = data.user.id;
            } else {
              console.error("Lỗi đồng bộ Google auth với BE:", data);
            }
          } catch (error) {
            console.error("Lỗi gọi API /auth/google:", error);
          }
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // 👇 THÊM MỚI: Ép kiểu để báo cho TS biết session có chứa accessToken
        (session as any).accessToken = token.accessToken as string; 
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", 
  },
});