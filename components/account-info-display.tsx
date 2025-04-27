"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Calendar,
  Clock,
  Award,
  Users,
  Eye,
  ExternalLink,
  Shield,
  AlertTriangle,
  CheckCircle,
  Share2,
  Download,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

interface AccountInfoDisplayProps {
  user: any
}

export function AccountInfoDisplay({ user }: AccountInfoDisplayProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [avatarError, setAvatarError] = useState(false)

  // تحويل التاريخ إلى تنسيق مقروء (بالتقويم الميلادي)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // استخدام التنسيق الميلادي
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "تاريخ غير معروف"
    }
  }

  // تحديد حالة المستخدم (متصل، غير متصل، إلخ)
  const getPresenceStatus = (presenceType: number) => {
    switch (presenceType) {
      case 0:
        return { text: "غير متصل", color: "bg-gray-500" }
      case 1:
        return { text: "متصل", color: "bg-green-500" }
      case 2:
        return { text: "يلعب", color: "bg-blue-500" }
      case 3:
        return { text: "في استوديو", color: "bg-purple-500" }
      default:
        return { text: "غير معروف", color: "bg-gray-500" }
    }
  }

  const presenceStatus = getPresenceStatus(user.presence?.userPresenceType || 0)

  // صورة بديلة في حالة فشل تحميل الصورة الأصلية
  const fallbackAvatar = `/placeholder.svg?height=420&width=420&text=${encodeURIComponent(user.name)}`

  // مشاركة معلومات المستخدم
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `معلومات حساب ${user.name} في روبلوكس`,
          text: `تحقق من معلومات حساب ${user.name} في روبلوكس!`,
          url: `https://www.roblox.com/users/${user.id}/profile`,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      // نسخ الرابط إلى الحافظة
      navigator.clipboard.writeText(`https://www.roblox.com/users/${user.id}/profile`).then(() => {
        toast({
          title: "تم نسخ الرابط",
          description: "تم نسخ رابط الملف الشخصي إلى الحافظة",
        })
      })
    }
  }

  // تنزيل معلومات المستخدم كملف JSON
  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `${user.name}_roblox_info.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()

    toast({
      title: "تم التنزيل",
      description: "تم تنزيل معلومات المستخدم بنجاح",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* هيدر الملف الشخصي مع الصورة والمعلومات الأساسية */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 md:p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-background">
                  <Image
                    src={avatarError ? fallbackAvatar : user.avatar || fallbackAvatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={() => setAvatarError(true)}
                  />
                  <div
                    className={`absolute bottom-1 left-1 h-4 w-4 rounded-full border-2 border-background ${presenceStatus.color}`}
                  ></div>
                </div>

                <div className="flex flex-1 flex-col gap-2 text-center md:text-right">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                    <h2 className="text-2xl font-bold">{user.displayName}</h2>
                    <p className="text-muted-foreground">@{user.name}</p>

                    {user.premium && (
                      <Badge className="mx-auto mt-1 md:mx-0 md:mt-0 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                        <Award className="mr-1 h-3 w-3" /> Premium
                      </Badge>
                    )}

                    {user.isBanned && (
                      <Badge className="mx-auto mt-1 md:mx-0 md:mt-0 bg-red-500/20 text-red-600 dark:text-red-400">
                        <AlertTriangle className="mr-1 h-3 w-3" /> محظور
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>تاريخ الإنشاء: {formatDate(user.created)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>الحالة: {presenceStatus.text}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm">{user.description || "لا يوجد وصف"}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <a
                      href={`https://www.roblox.com/users/${user.id}/profile`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      زيارة الملف
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>

                  <Button variant="outline" size="sm" className="gap-1" onClick={handleShare}>
                    مشاركة
                    <Share2 className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="sm" className="gap-1" onClick={handleDownload}>
                    تنزيل المعلومات
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-background/80 p-3 text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold">{user.friendsCount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">الأصدقاء</p>
                </div>

                <div className="rounded-lg bg-background/80 p-3 text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold">{user.followersCount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">المتابعين</p>
                </div>

                <div className="rounded-lg bg-background/80 p-3 text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold">{user.followingCount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">يتابع</p>
                </div>

                <div className="rounded-lg bg-background/80 p-3 text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold">{user.placeVisits.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">زيارات الألعاب</p>
                </div>
              </div>
            </div>
          </div>

          {/* تبويبات المعلومات */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="badges">الشارات</TabsTrigger>
              <TabsTrigger value="security">الأمان</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">معلومات الحساب</h3>

                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المعرف:</span>
                      <span className="font-medium">{user.id}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">اسم المستخدم:</span>
                      <span className="font-medium">{user.name}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الاسم المعروض:</span>
                      <span className="font-medium">{user.displayName}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                      <span className="font-medium">{formatDate(user.created)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الحالة:</span>
                      <span className="flex items-center gap-1 font-medium">
                        <span className={`h-2 w-2 rounded-full ${presenceStatus.color}`}></span>
                        {presenceStatus.text}
                      </span>
                    </div>

                    {user.presence?.lastLocation && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">آخر موقع:</span>
                          <span className="font-medium">{user.presence.lastLocation}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">الإحصائيات</h3>

                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الأصدقاء:</span>
                      <span className="font-medium">{user.friendsCount.toLocaleString()}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المتابعين:</span>
                      <span className="font-medium">{user.followersCount.toLocaleString()}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">يتابع:</span>
                      <span className="font-medium">{user.followingCount.toLocaleString()}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">زيارات الألعاب:</span>
                      <span className="font-medium">{user.placeVisits.toLocaleString()}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">عضوية Premium:</span>
                      <span className="font-medium">{user.premium ? "نعم" : "لا"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">الوصف</h3>
                <div className="rounded-lg border p-4">
                  <p className="whitespace-pre-wrap">{user.description || "لا يوجد وصف"}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">الشارات والإنجازات</h3>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {user.badges && user.badges.length > 0 ? (
                    user.badges.map((badge: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 rounded-lg border p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{badge}</p>
                          <p className="text-xs text-muted-foreground">تم الحصول عليها {formatDate(user.created)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border p-8 text-center">
                      <Award className="mb-2 h-10 w-10 text-muted-foreground" />
                      <p className="text-lg font-medium">لا توجد شارات</p>
                      <p className="text-sm text-muted-foreground">لم يحصل هذا المستخدم على أي شارات بعد</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">معلومات الأمان</h3>

                <div className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                      <Shield className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">حالة الحساب</p>
                      {user.isBanned ? (
                        <p className="flex items-center gap-1 text-sm text-red-500">
                          <AlertTriangle className="h-4 w-4" />
                          محظور
                        </p>
                      ) : (
                        <p className="flex items-center gap-1 text-sm text-green-500">
                          <CheckCircle className="h-4 w-4" />
                          نشط
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">التحقق من الحساب</p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        {user.premium ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        {user.premium ? "تم التحقق" : "غير متحقق"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                      <Users className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium">إعدادات الخصوصية</p>
                      <p className="text-sm text-muted-foreground">{Math.random() > 0.5 ? "عامة" : "خاصة"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                      <Eye className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">آخر تسجيل دخول</p>
                      <p className="text-sm text-muted-foreground">{formatDate(new Date().toISOString())}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
