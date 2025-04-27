"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { DiscordIconFA } from "@/components/discord-icon-fa"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { TermsDialog } from "@/components/terms-dialog"

export default function Login() {
  const { user, isLoading, signInWithDiscord } = useAuth()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  const handleLogin = async () => {
    // Check if user has accepted terms before
    const hasAcceptedTerms = localStorage.getItem("termsAccepted")

    if (!hasAcceptedTerms) {
      setShowTerms(true)
    } else {
      setIsAuthenticating(true)
      try {
        await signInWithDiscord()
      } catch (error) {
        console.error("Login error:", error)
      } finally {
        setIsAuthenticating(false)
      }
    }
  }

  const handleAcceptTerms = async () => {
    localStorage.setItem("termsAccepted", "true")
    setShowTerms(false)
    setIsAuthenticating(true)
    try {
      await signInWithDiscord()
    } catch (error) {
      console.error("Login error after accepting terms:", error)
    } finally {
      setIsAuthenticating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
            <CardDescription>قم بتسجيل الدخول باستخدام حساب Discord الخاص بك للوصول إلى سوق المنتجات</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={handleLogin}
              className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? <LoadingSpinner className="mr-2" /> : <DiscordIconFA className="mr-2 h-5 w-5" />}
              تسجيل الدخول باستخدام Discord
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            بالتسجيل، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا
          </CardFooter>
        </Card>
      </main>

      <TermsDialog open={showTerms} onOpenChange={setShowTerms} onAccept={handleAcceptTerms} />
    </div>
  )
}
