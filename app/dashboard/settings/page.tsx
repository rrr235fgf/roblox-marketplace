"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { DiscordIcon, TikTokIcon, InstagramIcon } from "@/components/social-icons"
import { getCurrentUserProfile } from "@/lib/api"

const socialAccountsSchema = z
  .object({
    discord: z.string().optional(),
    tiktok: z.string().optional(),
    instagram: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.discord || data.tiktok || data.instagram
    },
    {
      message: "يجب إضافة حساب واحد على الأقل من منصات التواصل الاجتماعي",
    },
  )

export default function SettingsPage() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)

  const form = useForm<z.infer<typeof socialAccountsSchema>>({
    resolver: zodResolver(socialAccountsSchema),
    defaultValues: {
      discord: "",
      tiktok: "",
      instagram: "",
    },
  })

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

        // تحديث النموذج بالبيانات الحالية
        if (profile?.socialAccounts) {
          form.reset({
            discord: profile.socialAccounts.discord || "",
            tiktok: profile.socialAccounts.tiktok || "",
            instagram: profile.socialAccounts.instagram || "",
          })
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoadingProfile(false)
      }
    }

    if (user) {
      fetchUserProfile()
    }
  }, [user, form])

  const onSubmit = async (values: z.infer<typeof socialAccountsSchema>) => {
    try {
      setSavingSettings(true)

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialAccounts: values,
        }),
      })

      if (!response.ok) {
        throw new Error("فشل في حفظ الإعدادات")
      }

      toast({
        title: "تم حفظ الإعدادات",
        description: "تم تحديث حسابات التواصل الاجتماعي بنجاح",
      })

      // إعادة تحميل البيانات
      const profile = await getCurrentUserProfile()
      setUserProfile(profile)
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      })
    } finally {
      setSavingSettings(false)
    }
  }

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
                  <p className="text-base">{user.name || "المستخدم"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</h3>
                  <p className="text-base">{user.email || "غير متوفر"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">تاريخ الانضمام</h3>
                  <p className="text-base">
                    {userProfile?.createdAt
                      ? new Date(userProfile.createdAt).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "غير متوفر"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">عدد الإعجابات</h3>
                  <p className="text-base">{userProfile?.likes || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>حسابات التواصل الاجتماعي</CardTitle>
              <CardDescription>
                أضف حسابات التواصل الاجتماعي الخاصة بك للتواصل مع العملاء (مطلوب حساب واحد على الأقل)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="discord"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DiscordIcon className="h-4 w-4 text-[#5865F2]" />
                          Discord
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="اسم المستخدم في Discord" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tiktok"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <TikTokIcon className="h-4 w-4" />
                          TikTok
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="اسم المستخدم في TikTok" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <InstagramIcon className="h-4 w-4 text-[#E4405F]" />
                          Instagram
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="اسم المستخدم في Instagram" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={savingSettings}>
                    {savingSettings ? (
                      <>
                        <LoadingSpinner className="mr-2" />
                        جاري الحفظ...
                      </>
                    ) : (
                      "حفظ الإعدادات"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تسجيل الخروج</CardTitle>
              <CardDescription>تسجيل الخروج من حسابك الحالي</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={signOut}>
                تسجيل الخروج
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
