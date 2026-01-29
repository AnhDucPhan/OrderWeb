// auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Validate input
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // 1. In ra URL để kiểm tra xem có đúng địa chỉ Backend không
          console.log("Calling API:", `${process.env.NEXT_PUBLIC_API_URL}/auth/login`);

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          // 2. Lấy dữ liệu trả về
          const data = await res.json();

          // 3. In ra log để xem Backend trả về gì (Quan trọng!)
          console.log("Backend Response:", { status: res.status, data });

          if (!res.ok) {
            // Nếu sai pass/email, NextAuth sẽ coi việc throw Error này là CredentialsSignin
            throw new Error(data?.message || "Đăng nhập thất bại");
          }

          // Nếu thành công
          if (data && data.access_token) {
            return {
              ...data.user,
              accessToken: data.access_token,
            };
          }

          return null;

        } catch (error) {
          // 4. In ra lỗi nếu fetch bị hỏng (ví dụ backend chưa bật)
          console.error("Authorize Error:", error);
          return null; // Trả về null để báo cho NextAuth biết là login thất bại
        }
      },
    }),
  ],
  callbacks: {
    // 1. Chạy khi đăng nhập thành công: Lưu token từ User vào JWT (Cookie)
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    // 2. Chạy khi Frontend gọi useSession(): Lấy token từ JWT trả về cho Client dùng
    async session({ session, token }) {
      if (token) {
        (session as any).accessToken = token.accessToken;
        (session as any).user.role = token.role;
        (session as any).user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Đường dẫn tới trang login tùy chỉnh của bạn
  },
});