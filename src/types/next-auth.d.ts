import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Mở rộng interface Session để chứa accessToken và id
   */
  interface Session {
    accessToken?: string
    user: {
      id: string
      role: string
      // Các field khác (role, address...) nếu cần
    } & DefaultSession["user"]
  }

  /**
   * Mở rộng interface User (kết quả trả về từ hàm authorize hoặc profile)
   */
  interface User {
    accessToken?: string
    id?: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  /**
   * Mở rộng interface JWT để chứa thông tin bạn nhét vào từ callback
   */
  interface JWT {
    accessToken?: string
    id?: string
    role?: string
  }
}