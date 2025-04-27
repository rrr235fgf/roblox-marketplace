"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AssetGrid } from "@/components/asset-grid"
import { getUserProfile } from "@/lib/api"
import type { Seller } from "@/lib/types"

// تحديد ألوان الشارات
const getBadgeColor = (badge: string) => {
  switch (badge) {
    case "مميز":
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
    case "مشهور":
      return "bg-red-500 text-white"
    case "ادارة":
      return "bg-blue-500 text-white"
    case "موثوق":
      return "bg-green-500 text-white"
    case "عضو جديد":
      return "bg-gray-500 text-white"
    case "عضو نشط":
      return "bg-purple-500 text-white"
    case "عضو متميز":
      return "bg-indigo-500 text-white"
    case "عضو محترف":
      return "bg-primary text-white"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

export default function ProfilePage() {
  const { id } = useParams()
  const [seller, setSeller] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (typeof id === "string") {
          const userData = await getUserProfile(id)
          setSeller(userData)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  const handleContactSeller = () => {
    if (!seller) return

    // Open Discord DM with the seller
    window.open(`https://discord.com/users/${seller.discordId}`, "_blank")
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

  // تنسيق التاريخ بالتقويم الميلادي
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
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
            <Image src={seller.avatar || "/placeholder.svg"} alt={seller.username} fill className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col gap-4 text-center md:text-right">
            <div>
              <h1 className="text-3xl font-bold">{seller.username}</h1>
              <p className="text-muted-foreground">عضو منذ {formatDate(seller.joinDate)}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {seller.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className={`${getBadgeColor(badge)}`}>
                  {badge}
                </Badge>
              ))}
            </div>

            <div className="flex justify-center gap-4 md:justify-start">
              <div>
                <p className="text-2xl font-bold">{seller.listedAssets}</p>
                <p className="text-sm text-muted-foreground">المنتجات المعروضة</p>
              </div>
            </div>
          </div>

          <Button onClick={handleContactSeller} className="md:self-start">
            <MessageCircle className="mr-2 h-4 w-4" />
            التواصل عبر Discord
          </Button>
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
