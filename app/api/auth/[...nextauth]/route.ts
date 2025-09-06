import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByEmail, createUser } from "@/lib/db"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      emailVerified?: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    emailVerified?: boolean
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", optional: true },
        isSignUp: { label: "Is Sign Up", type: "text", optional: true },
        verificationToken: { label: "Verification Token", type: "text", optional: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const isSignUp = credentials.isSignUp === "true"

          if (isSignUp) {
            // التسجيل
            if (!credentials.name) {
              throw new Error("الاسم مطلوب للتسجيل")
            }

            // التحقق من وجود المستخدم
            const existingUser = await getUserByEmail(credentials.email)
            if (existingUser) {
              throw new Error("البريد الإلكتروني مستخدم بالفعل")
            }

            // تشفير كلمة المرور
            const hashedPassword = await bcrypt.hash(credentials.password, 12)

            // إنشاء المستخدم الجديد
            const newUser = await createUser({
              id: crypto.randomUUID(),
              username: credentials.name,
              email: credentials.email,
              avatar: "/placeholder.svg",
              password: hashedPassword,
              badges: ["عضو جديد"],
              joinDate: new Date().toISOString(),
              totalSales: 0,
              listedAssets: 0,
              averageRating: 0,
              emailVerified: false,
            })

            return {
              id: newUser.id,
              name: newUser.username,
              email: newUser.email,
              image: newUser.avatar,
              emailVerified: false,
            }
          } else {
            // تسجيل الدخول
            const user = await getUserByEmail(credentials.email)
            if (!user) {
              throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة")
            }

            if (!user.password) {
              throw new Error("حساب غير صحيح")
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
            if (!isPasswordValid) {
              throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة")
            }

            return {
              id: user.id,
              name: user.username,
              email: user.email,
              image: user.avatar,
              emailVerified: user.emailVerified || false,
            }
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.emailVerified = (user as any).emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || ""
        session.user.emailVerified = (token.emailVerified as boolean) || false
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "YOUR_FALLBACK_SECRET_KEY_CHANGE_THIS",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
