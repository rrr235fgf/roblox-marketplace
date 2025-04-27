import NextAuth, { type NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { getUserByDiscordId, createUser, updateUser } from "@/lib/db"

// تعريف أنواع البيانات المتوقعة من Discord
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      discordId?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    discordId?: string
  }
}

// استخدام بيانات الاعتماد الجديدة
const DISCORD_CLIENT_ID = "1352065270382071881"
const DISCORD_CLIENT_SECRET = "7AJkLEKW6BusaWJCmGbfOBtuAB0LOXnC"

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify", // Eliminamos "email" ya que no lo necesitamos
        },
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development", // تمكين وضع التصحيح فقط في بيئة التطوير
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id = profile.id || profile.sub
        token.discordId = profile.id || profile.sub
        token.image =
          profile.image ||
          (profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || ""
        session.user.discordId = (token.discordId as string) || ""
        session.user.image = (token.image as string) || null
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        if (!profile) return false

        const discordId = profile.id || profile.sub
        if (!discordId) {
          console.error("Discord ID is missing from profile", profile)
          return false
        }

        const existingUser = await getUserByDiscordId(discordId)

        // Asignar rol de administración a tu cuenta (reemplaza TU_DISCORD_ID con tu ID real)
        const isAdmin = discordId === "1014660591366971483"
        const badges = isAdmin ? ["عضو جديد", "ادارة"] : ["عضو جديد"]

        if (!existingUser) {
          await createUser({
            id: discordId,
            username: profile.username || user.name || "مستخدم جديد",
            email: profile.email || user.email,
            avatar:
              user.image ||
              (profile.avatar
                ? `https://cdn.discordapp.com/avatars/${discordId}/${profile.avatar}.png`
                : "/placeholder.svg"),
            discordId: discordId,
            badges: badges,
            joinDate: new Date().toISOString(),
            totalSales: 0,
            listedAssets: 0,
            averageRating: 0,
          })
        } else if (isAdmin && !existingUser.badges.includes("ادارة")) {
          // Si la cuenta ya existe pero no tiene el rol de administración, agregarlo
          const updatedBadges = [...existingUser.badges, "ادارة"]
          await updateUser(existingUser.id, { badges: updatedBadges })
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
  useSecureCookies: process.env.NODE_ENV === "production", // Usar cookies seguras solo en producción
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
