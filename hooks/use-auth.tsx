"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSession, signOut as nextAuthSignOut } from "next-auth/react"

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  provider?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
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
        provider: (session.user.provider as string) || "",
      }
    : null

  const signOut = () => {
    nextAuthSignOut({ callbackUrl: "/" })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signOut,
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
