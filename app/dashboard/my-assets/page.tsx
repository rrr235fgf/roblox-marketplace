"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Trash, Eye, Package } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { DashboardNav } from "@/components/dashboard-nav"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useAuth } from "@/hooks/use-auth"
import { getAssets, deleteAsset } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function MyAssetsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [assets, setAssets] = useState<any[]>([])
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        if (user) {
          const userAssets = await getAssets({ sellerId: user.id })
          setAssets(userAssets)
        }
      } catch (error) {
        console.error("Error fetching assets:", error)
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب المنتجات",
          variant: "destructive",
        })
      } finally {
        setLoadingAssets(false)
      }
    }

    if (user) {
      fetchAssets()
    }
  }, [user])

  const handleDeleteAsset = async () => {
    if (!deletingAssetId) return

    try {
      await deleteAsset(deletingAssetId)

      // تحديث قائمة الأصول بعد الحذف
      setAssets(assets.filter((asset) => asset.id !== deletingAssetId))

      toast({
        title: "تم الحذف",
        description: "تم حذف المنتج بنجاح",
      })
    } catch (error) {
      console.error("Error deleting asset:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المنتج",
        variant: "destructive",
      })
    } finally {
      setDeletingAssetId(null)
      setShowDeleteAlert(false)
    }
  }

  const confirmDelete = (assetId: string) => {
    setDeletingAssetId(assetId)
    setShowDeleteAlert(true)
  }

  if (isLoading || (loadingAssets && user)) {
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

  const categoryColors: Record<string, string> = {
    maps: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    systems: "bg-green-500/10 text-green-600 dark:text-green-400",
    games: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    other: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    mm2: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    bloxfruit: "bg-green-500/10 text-green-600 dark:text-green-400",
    timewar: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    robux: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    accounts: "bg-red-500/10 text-red-600 dark:text-red-400",
    development: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] py-8">
        <DashboardNav />
        <main className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">منتجاتي</h1>
              <p className="text-muted-foreground">إدارة المنتجات التي قمت بنشرها في السوق</p>
            </div>
            <Button onClick={() => router.push("/dashboard/create")}>
              <Plus className="mr-2 h-4 w-4" /> إضافة منتج جديد
            </Button>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">جميع المنتجات</TabsTrigger>
              <TabsTrigger value="mm2">ام ام تو</TabsTrigger>
              <TabsTrigger value="bloxfruit">بلوكس فروت</TabsTrigger>
              <TabsTrigger value="timewar">حرب الوقت</TabsTrigger>
              <TabsTrigger value="robux">روبوكس</TabsTrigger>
              <TabsTrigger value="accounts">حسابات</TabsTrigger>
              <TabsTrigger value="development">تطوير</TabsTrigger>
              <TabsTrigger value="other">اخرى</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {loadingAssets ? (
                <div className="flex h-64 items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              ) : assets.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-6">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">لا توجد منتجات</h3>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      لم تقم بنشر أي منتجات بعد. ابدأ بإضافة منتج جديد.
                    </p>
                    <Button className="mt-6" onClick={() => router.push("/dashboard/create")}>
                      <Plus className="mr-2 h-4 w-4" /> إضافة منتج جديد
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {assets.map((asset) => (
                    <Card key={asset.id} className="overflow-hidden">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={asset.images[0] || "/placeholder.svg"}
                          alt={asset.title}
                          fill
                          className="object-cover"
                        />
                        <Badge
                          className={`absolute right-2 top-2 ${categoryColors[asset.category] || categoryColors.other}`}
                        >
                          {asset.category}
                        </Badge>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <CardTitle className="line-clamp-1 text-lg">{asset.title}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">خيارات</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/assets/${asset.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>عرض</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => confirmDelete(asset.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                <span>حذف</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="line-clamp-2 text-sm text-muted-foreground">{asset.description}</p>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between border-t p-4">
                        <p className="text-sm text-muted-foreground">
                          {new Date(asset.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="font-medium">
                          {asset.price.toLocaleString()}{" "}
                          <span className="text-xs">
                            {asset.paymentMethod === "riyal"
                              ? "ريال"
                              : asset.paymentMethod === "credit"
                                ? "كريديت"
                                : "Robux"}
                          </span>
                        </p>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {["mm2", "bloxfruit", "timewar", "robux", "accounts", "development", "other"].map((category) => (
              <TabsContent key={category} value={category}>
                {loadingAssets ? (
                  <div className="flex h-64 items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : assets.filter((asset) => asset.category === category).length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-muted p-6">
                        <Package className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium">لا توجد منتجات</h3>
                      <p className="mt-2 text-center text-sm text-muted-foreground">
                        لم تقم بنشر أي منتجات في هذه الفئة بعد.
                      </p>
                      <Button className="mt-6" onClick={() => router.push("/dashboard/create")}>
                        <Plus className="mr-2 h-4 w-4" /> إضافة منتج جديد
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {assets
                      .filter((asset) => asset.category === category)
                      .map((asset) => (
                        <Card key={asset.id} className="overflow-hidden">
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={asset.images[0] || "/placeholder.svg"}
                              alt={asset.title}
                              fill
                              className="object-cover"
                            />
                            <Badge
                              className={`absolute right-2 top-2 ${categoryColors[asset.category] || categoryColors.other}`}
                            >
                              {asset.category}
                            </Badge>
                          </div>
                          <CardHeader className="p-4">
                            <div className="flex items-start justify-between">
                              <CardTitle className="line-clamp-1 text-lg">{asset.title}</CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">خيارات</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/assets/${asset.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>عرض</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => confirmDelete(asset.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    <span>حذف</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="line-clamp-2 text-sm text-muted-foreground">{asset.description}</p>
                          </CardContent>
                          <CardFooter className="flex items-center justify-between border-t p-4">
                            <p className="text-sm text-muted-foreground">
                              {new Date(asset.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p className="font-medium">
                              {asset.price.toLocaleString()}{" "}
                              <span className="text-xs">
                                {asset.paymentMethod === "riyal"
                                  ? "ريال"
                                  : asset.paymentMethod === "credit"
                                    ? "كريديت"
                                    : "Robux"}
                              </span>
                            </p>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المنتج؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المنتج نهائيًا من حسابك ومن السوق.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAsset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
