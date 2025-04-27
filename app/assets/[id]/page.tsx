"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Share2, Shield, Clock, ArrowLeft, X, Maximize } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useAuth } from "@/hooks/use-auth"
import { getAssetById } from "@/lib/api"
import type { Asset } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { RobuxIcon, RiyalIcon, CreditIcon } from "@/components/payment-icons"

export default function AssetPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true)
        setError(null)

        if (typeof id === "string") {
          const assetData = await getAssetById(id)

          if (assetData) {
            setAsset(assetData)
            // Set document title with product name
            document.title = `${assetData.title} | سوق روبلوكس`
          } else {
            setError("لم يتم العثور على المنتج")
            document.title = "منتج غير موجود | سوق روبلوكس"
          }
        } else {
          setError("معرف المنتج غير صالح")
          document.title = "منتج غير موجود | سوق روبلوكس"
        }
      } catch (error) {
        console.error("Error fetching asset:", error)
        setError("حدث خطأ أثناء تحميل المنتج")
        document.title = "خطأ | سوق روبلوكس"
      } finally {
        setLoading(false)
      }
    }

    fetchAsset()
  }, [id])

  const handleContactSeller = () => {
    if (!asset) return

    // التحقق من وجود معرف Discord للبائع
    if (!asset.seller?.discordId) {
      toast({
        title: "خطأ",
        description: "معرف Discord للبائع غير متوفر",
        variant: "destructive",
      })
      return
    }

    // Open Discord DM with the seller
    window.open(`https://discord.com/users/${asset.seller.discordId}`, "_blank")
  }

  const handleShare = () => {
    if (!asset) return

    // نسخ رابط المنتج إلى الحافظة
    const url = `${window.location.origin}/assets/${asset.id}`
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: "تم النسخ",
          description: "تم نسخ رابط المنتج بنجاح",
        })
      })
      .catch((err) => {
        console.error("فشل نسخ الرابط:", err)
        toast({
          title: "خطأ",
          description: "فشل نسخ الرابط",
          variant: "destructive",
        })
      })
  }

  const toggleFullscreen = () => {
    setIsImageFullscreen(!isImageFullscreen)
  }

  const categoryColors: Record<string, string> = {
    "ام ام تو": "bg-red-500/10 text-red-600 dark:text-red-400",
    "بلوكس فروت": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    "حرب الوقت": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    روبوكس: "bg-green-500/10 text-green-600 dark:text-green-400",
    حسابات: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    تطوير: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    "اشياء اخرى": "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  }

  const categoryColor = asset?.category ? categoryColors[asset.category] || categoryColors["اشياء اخرى"] : ""

  // تنسيق التاريخ بالتقويم الميلادي
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "تاريخ غير صالح"
    }
  }

  // عرض أيقونة طريقة الدفع
  const renderPaymentIcon = () => {
    if (!asset || !asset.paymentMethod) return null

    switch (asset.paymentMethod) {
      case "robux":
        return <RobuxIcon className="h-5 w-5 mr-1" />
      case "riyal":
        return <RiyalIcon className="h-5 w-5 mr-1" />
      case "credit":
        return <CreditIcon className="h-5 w-5 mr-1" />
      default:
        return null
    }
  }

  // الحصول على اسم طريقة الدفع
  const getPaymentMethodName = () => {
    if (!asset || !asset.paymentMethod) return "روبوكس"

    switch (asset.paymentMethod) {
      case "robux":
        return "روبوكس"
      case "riyal":
        return "ريال سعودي"
      case "credit":
        return "كريديت"
      default:
        return "روبوكس"
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

  if (error || !asset) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-destructive">{error || "لم يتم العثور على المنتج"}</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/assets")}>
              العودة إلى المنتجات
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // التأكد من وجود صور صالحة
  const validImages = Array.isArray(asset.images) && asset.images.length > 0 ? asset.images : ["/placeholder.svg"]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container py-4 md:py-8">
        <Button
          variant="ghost"
          className="mb-4 md:mb-6 flex items-center gap-2 text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          العودة
        </Button>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          <div className="space-y-3 md:space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border">
              <Image
                src={validImages[selectedImage] || "/placeholder.svg"}
                alt={asset.title}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  // إذا فشل تحميل الصورة، استخدم صورة بديلة
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80 z-10"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {validImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square overflow-hidden rounded-lg border ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${asset.title} - صورة ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      // إذا فشل تحميل الصورة، استخدم صورة بديلة
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Badge className={`${categoryColor}`}>{asset.category}</Badge>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    onClick={handleShare}
                    title="نسخ رابط المنتج"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold">{asset.title}</h1>

              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>تم النشر {formatDate(asset.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xl md:text-2xl font-bold">
                  {renderPaymentIcon()}
                  {asset.price.toLocaleString()}{" "}
                  <span className="text-sm text-muted-foreground mr-1">{getPaymentMethodName()}</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                  متوفر
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium">الوصف</h3>
              <p className="text-muted-foreground">{asset.description}</p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border p-4">
              <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-full border">
                <Image
                  src={asset.seller?.avatar || "/placeholder.svg"}
                  alt={asset.seller?.username || "البائع"}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    // إذا فشل تحميل الصورة، استخدم صورة بديلة
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{asset.seller?.username || "البائع"}</p>
                <div className="flex flex-wrap gap-1">
                  {(asset.seller?.badges || []).map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/profile/${asset.seller?.id || ""}`)}
                disabled={!asset.seller?.id}
              >
                عرض الملف
              </Button>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleContactSeller} className="flex-1 gap-2" disabled={!user}>
                <MessageCircle className="h-4 w-4" />
                التواصل مع البائع
              </Button>
            </div>

            {!user && (
              <p className="text-center text-sm text-muted-foreground">يجب عليك تسجيل الدخول للتواصل مع البائع</p>
            )}

            <div className="grid grid-cols-2 gap-3 rounded-xl border p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">ضمان الجودة</p>
                  <p className="text-xs text-muted-foreground">منتجات عالية الجودة</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">دعم فني</p>
                  <p className="text-xs text-muted-foreground">مساعدة على مدار الساعة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal para imagen a pantalla completa */}
      {isImageFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 z-10 rounded-full"
              onClick={toggleFullscreen}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="relative h-full w-full">
              <Image
                src={validImages[selectedImage] || "/placeholder.svg"}
                alt={asset.title}
                className="object-contain mx-auto max-h-[85vh] w-auto"
                width={1200}
                height={900}
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
