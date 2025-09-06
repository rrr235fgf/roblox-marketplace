"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("رمز التحقق مفقود")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          setIsVerified(true)
          toast({
            title: "تم التحقق بنجاح",
            description: "تم التحقق من بريدك الإلكتروني بنجاح",
          })
        } else {
          setError(data.error || "فشل في التحقق من البريد الإلكتروني")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setError("حدث خطأ أثناء التحقق")
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [token, toast])

  const handleContinue = () => {
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {isLoading ? (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
                  <LoadingSpinner />
                </div>
                <CardTitle className="text-2xl">جاري التحقق...</CardTitle>
                <CardDescription>يرجى الانتظار بينما نتحقق من بريدك الإلكتروني</CardDescription>
              </>
            ) : isVerified ? (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">تم التحقق بنجاح!</CardTitle>
                <CardDescription>تم التحقق من بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.</CardDescription>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-2xl">فشل في التحقق</CardTitle>
                <CardDescription>{error}</CardDescription>
              </>
            )}
          </CardHeader>
          {!isLoading && (
            <CardContent>
              <Button onClick={handleContinue} className="w-full">
                {isVerified ? "تسجيل الدخول" : "العودة لتسجيل الدخول"}
              </Button>
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  )
}
