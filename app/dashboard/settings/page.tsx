"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getCurrentUserProfile } from "@/lib/api"

export default function SettingsPage() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getCurrentUserProfile()
        setUserProfile(profile)
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoadingProfile(false)
      }
    }

    if (user) {
      fetchUserProfile()
    }
  }, [user])

  if (isLoading || loadingProfile) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] py-8">
        <DashboardNav />
        <main className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">الإعدادات</h1>
            <p className="text-muted-foreground">إدارة إعدادات حسابك</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>حسابك</CardTitle>
              <CardDescription>معلومات حسابك الأساسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">اسم المستخدم</h3>
                  <p className="text-base">{userProfile?.username || user.name || "المستخدم"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</h3>
                  <p className="text-base">{user.email || "غير متوفر"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">تاريخ الانضمام</h3>
                  <p className="text-base">
                    {userProfile?.joinDate
                      ? new Date(userProfile.joinDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "غير متوفر"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">حساب Discord</h3>
                  <p className="text-base">متصل</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">تسجيل الخروج</h3>
                <p className="text-sm text-muted-foreground">تسجيل الخروج من حسابك الحالي</p>
                <Button variant="destructive" onClick={signOut}>
                  تسجيل الخروج
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
