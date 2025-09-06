import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import DiscordProvider from "next-auth/providers/discord"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import { getUserByEmail, createUser } from "@/lib/db"

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = Promise.resolve(client)

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Discord Provider (للمستخدمين القدامى)
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    // Credentials Provider (للتسجيل الجديد)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" }, // "login" or "register"
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان")
        }

        try {
          if (credentials.action === "register") {
            // التحقق من وجود المستخدم
            const existingUser = await getUserByEmail(credentials.email)
            if (existingUser) {
              throw new Error("هذا البريد الإلكتروني مستخدم بالفعل")
            }

            // إنشاء مستخدم جديد
            const hashedPassword = await bcrypt.hash(credentials.password, 12)
            const newUser = await createUser({
              email: credentials.email,
              password: hashedPassword,
              name: credentials.name || credentials.email.split("@")[0],
              image: null,
              emailVerified: new Date(), // تفعيل تلقائي
            })

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              image: newUser.image,
            }
          } else {
            // تسجيل دخول
            const user = await getUserByEmail(credentials.email)
            if (!user || !user.password) {
              throw new Error("بيانات الدخول غير صحيحة")
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
            if (!isPasswordValid) {
              throw new Error("بيانات الدخول غير صحيحة")
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            }
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})

export { handler as GET, handler as POST }
