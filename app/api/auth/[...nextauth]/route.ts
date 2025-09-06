import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByEmail, createUser, updateUser } from "@/lib/db"
import bcrypt from "bcryptjs"

// تعريف أنواع البيانات المتوقعة
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      provider?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    provider?: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", optional: true },
        isSignUp: { label: "Is Sign Up", type: "text", optional: true },
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
              provider: "credentials",
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
            }
          } else {
            // تسجيل الدخول
            const user = await getUserByEmail(credentials.email)
            if (!user) {
              throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة")
            }

            if (!user.password) {
              throw new Error("هذا الحساب مسجل عبر Google، يرجى استخدام تسجيل الدخول عبر Google")
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
            }
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && user) {
        token.id = user.id
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || ""
        session.user.provider = (token.provider as string) || ""
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          if (!user.email) return false

          const existingUser = await getUserByEmail(user.email)

          // تحديد ما إذا كان المستخدم مسؤولاً (يمكنك تغيير هذا البريد الإلكتروني)
          const isAdmin = user.email === "admin@example.com"
          const badges = isAdmin ? ["عضو جديد", "ادارة"] : ["عضو جديد"]

          if (!existingUser) {
            const newUser = await createUser({
              id: crypto.randomUUID(),
              username: user.name || "مستخدم جديد",
              email: user.email,
              avatar: user.image || "/placeholder.svg",
              provider: "google",
              badges: badges,
              joinDate: new Date().toISOString(),
              totalSales: 0,
              listedAssets: 0,
              averageRating: 0,
              emailVerified: true,
            })
            user.id = newUser.id
          } else {
            // تحديث معلومات المستخدم إذا لزم الأمر
            if (isAdmin && !existingUser.badges.includes("ادارة")) {
              const updatedBadges = [...existingUser.badges, "ادارة"]
              await updateUser(existingUser.id, { badges: updatedBadges })
            }
            user.id = existingUser.id
          }
        }

        return true
      } catch (error) {
        console.error("Error during sign in:", error)
        return false
      }
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
