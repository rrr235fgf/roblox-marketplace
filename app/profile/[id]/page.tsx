"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AssetGrid } from "@/components/asset-grid"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { DiscordIcon, TikTokIcon, InstagramIcon } from "@/components/social-icons"
import { getUserProfile } from "@/lib/api"
import type { Seller } from "@/lib/types"

export default function ProfilePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [seller, setSeller] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (typeof id === "string") {
          const userData = await getUserProfile(id)
          setSeller(userData)
          setLikesCount(userData.likes || 0)

          // التحقق من إعجاب المستخدم الحالي
          if (user) {
            const response = await fetch(`/api/profile/${id}/like-status`)
            if (response.ok) {
              const { isLiked } = await response.json()
              setIsLiked(isLiked)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id, user])

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب تسجيل الدخول للإعجاب بالملف الشخصي",
        variant: "destructive",
      })
      return
    }

    if (user.id === id) {
      toast({
        title: "غير مسموح",
        description: "لا يمكنك الإعجاب بملفك الشخصي",
        variant: "destructive",
      })
      return
    }

    try {
      setLiking(true)
      const response = await fetch(`/api/profile/${id}/like`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("فشل في تسجيل الإعجاب")
      }

      const { isLiked: newIsLiked, likesCount: newLikesCount } = await response.json()
      setIsLiked(newIsLiked)
      setLikesCount(newLikesCount)

      toast({
        title: newIsLiked ? "تم الإعجاب" : "تم إلغاء الإعجاب",
        description: newIsLiked ? "تم إضافة إعجابك" : "تم إلغاء إعجابك",
      })
    } catch (error) {
      console.error("Error liking profile:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الإعجاب",
        variant: "destructive",
      })
    } finally {
      setLiking(false)
    }
  }

  const handleContactSeller = (platform: string, username: string) => {
    let url = ""
    switch (platform) {
      case "discord":
        url = `https://discord.com/users/${username}`
        break
      case "tiktok":
        url = `https://www.tiktok.com/@${username}`
        break
      case "instagram":
        url = `https://www.instagram.com/${username}`
        break
    }
    if (url) {
      window.open(url, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xl">لم يتم العثور على المستخدم</p>
        </div>
      </div>
    )
  }

  // تنسيق التاريخ بالتقويم الهجري
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="relative h-32 w-32 overflow-hidden rounded-full">
            <Image
              src={seller.avatar || "/placeholder.svg?height=128&width=128"}
              alt={seller.username}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col gap-4 text-center md:text-right">
            <div>
              <h1 className="text-3xl font-bold">{seller.username}</h1>
              <p className="text-muted-foreground">عضو منذ {formatDate(seller.createdAt || seller.joinDate)}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {seller.badges?.map((badge) => (
                <Badge key={badge} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>

            <div className="flex justify-center gap-4 md:justify-start">
              <div>
                <p className="text-2xl font-bold">{seller.listedAssets || 0}</p>
                <p className="text-sm text-muted-foreground">المنتجات المعروضة</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{likesCount}</p>
                <p className="text-sm text-muted-foreground">الإعجابات</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleLike}
              disabled={liking || user?.id === id}
              variant={isLiked ? "default" : "outline"}
              className="md:self-start"
            >
              <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              {isLiked ? "معجب" : "إعجاب"}
            </Button>

            {seller.socialAccounts && (
              <div className="flex flex-col gap-2">
                {seller.socialAccounts.discord && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactSeller("discord", seller.socialAccounts.discord)}
                  >
                    <DiscordIcon className="mr-2 h-4 w-4 text-[#5865F2]" />
                    Discord
                  </Button>
                )}
                {seller.socialAccounts.tiktok && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactSeller("tiktok", seller.socialAccounts.tiktok)}
                  >
                    <TikTokIcon className="mr-2 h-4 w-4" />
                    TikTok
                  </Button>
                )}
                {seller.socialAccounts.instagram && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactSeller("instagram", seller.socialAccounts.instagram)}
                  >
                    <InstagramIcon className="mr-2 h-4 w-4 text-[#E4405F]" />
                    Instagram
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator className="my-8" />

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">جميع المنتجات</TabsTrigger>
            <TabsTrigger value="mm2">ام ام تو</TabsTrigger>
            <TabsTrigger value="bloxfruit">بلوكس فروت</TabsTrigger>
            <TabsTrigger value="timewar">حرب الوقت</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <AssetGrid sellerId={seller.id} />
          </TabsContent>
          <TabsContent value="mm2">
            <AssetGrid sellerId={seller.id} category="mm2" />
          </TabsContent>
          <TabsContent value="bloxfruit">
            <AssetGrid sellerId={seller.id} category="bloxfruit" />
          </TabsContent>
          <TabsContent value="timewar">
            <AssetGrid sellerId={seller.id} category="timewar" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
