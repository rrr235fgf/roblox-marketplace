import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = Promise.resolve(client)

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
  }
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", optional: true },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان")
        }

        try {
          const db = client.db("roblox_marketplace")

          if (credentials.action === "register") {
            // التحقق من وجود المستخدم
            const existingUser = await db.collection("users").findOne({ email: credentials.email })
            if (existingUser) {
              throw new Error("هذا البريد الإلكتروني مستخدم بالفعل")
            }

            // إنشاء مستخدم جديد
            const hashedPassword = await bcrypt.hash(credentials.password, 12)
            const newUser = {
              name: credentials.name || credentials.email.split("@")[0],
              email: credentials.email,
              password: hashedPassword,
              image: null,
              emailVerified: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
              likes: 0,
              socialAccounts: {
                discord: null,
                tiktok: null,
                instagram: null,
              },
            }

            const result = await db.collection("users").insertOne(newUser)

            return {
              id: result.insertedId.toString(),
              name: newUser.name,
              email: newUser.email,
              image: newUser.image,
            }
          } else {
            // تسجيل دخول
            const user = await db.collection("users").findOne({ email: credentials.email })
            if (!user || !user.password) {
              throw new Error("بيانات الدخول غير صحيحة")
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
            if (!isPasswordValid) {
              throw new Error("بيانات الدخول غير صحيحة")
            }

            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
