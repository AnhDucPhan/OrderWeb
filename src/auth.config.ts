import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authConfig = {
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
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

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
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === "credentials") {
          token.accessToken = (user as any).accessToken;
          token.role = (user as any).role;
          token.id = (user as any).id;
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
        (session as any).accessToken = token.accessToken as string; 
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", 
  },
} satisfies NextAuthConfig;