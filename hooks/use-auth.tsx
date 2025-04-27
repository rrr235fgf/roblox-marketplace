"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  discordId?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signInWithDiscord: () => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  const user = session?.user
    ? {
        id: (session.user.id as string) || "",
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
        discordId: (session.user.discordId as string) || "",
      }
    : null

  const signInWithDiscord = async () => {
    try {
      // استخدام عنوان مطلق للتأكد من صحة إعادة التوجيه
      await signIn("discord", { callbackUrl: "https://www.arabindustry.info/dashboard" })
    } catch (error) {
      console.error("Error signing in with Discord:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithDiscord,
        signOut: () => signOut({ callbackUrl: "/" }),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
