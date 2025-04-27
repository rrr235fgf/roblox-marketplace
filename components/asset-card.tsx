"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Asset } from "@/lib/types"
import Image from "next/image"

interface AssetCardProps {
  asset: Asset
  featured?: boolean
}

export function AssetCard({ asset, featured = false }: AssetCardProps) {
  const categoryColors: Record<string, string> = {
    "ام ام تو": "bg-red-500/10 text-red-600 dark:text-red-400",
    "بلوكس فروت": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    "حرب الوقت": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    روبوكس: "bg-green-500/10 text-green-600 dark:text-green-400",
    حسابات: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    تطوير: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    "اشياء اخرى": "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  }

  const categoryColor = categoryColors[asset.category] || categoryColors["اشياء اخرى"]

  // تعديل الجزء الخاص بالصور

  // التأكد من وجود صورة صالحة
  const mainImage = Array.isArray(asset.images) && asset.images.length > 0 ? asset.images[0] : "/placeholder.svg"

  // التأكد من وجود معلومات البائع
  const seller = asset.seller || {
    id: "unknown",
    username: "مستخدم غير معروف",
    avatar: "/placeholder.svg",
    badges: [],
    discordId: "",
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-primary/5">
      <Link href={`/assets/${asset.id}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* تعديل الجزء الخاص بعرض الصورة الرئيسية */}
          <Image
            src={mainImage || "/placeholder.svg"}
            alt={asset.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
            onError={(e) => {
              // إذا فشل تحميل الصورة، استخدم صورة بديلة
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <Badge className={`absolute right-3 top-3 border-0 ${categoryColor}`}>{asset.category}</Badge>

          {featured && (
            <div className="absolute left-0 top-3 rounded-e-full bg-primary px-3 py-1 text-xs font-medium text-white">
              مميز
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col p-3 md:p-4">
          <h3 className="mb-1 line-clamp-1 text-base md:text-lg font-bold">{asset.title}</h3>
          <p className="line-clamp-2 flex-1 text-xs md:text-sm text-muted-foreground">{asset.description}</p>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t bg-muted/30 p-3 md:p-4">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 md:h-7 md:w-7 overflow-hidden rounded-full border border-border">
              {/* تعديل الجزء الخاص بصورة البائع */}
              <Image
                src={seller.avatar || "/placeholder.svg"}
                alt={seller.username}
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
            <span className="text-xs font-medium">{seller.username}</span>
          </div>
          <div className="flex items-center rounded-full bg-primary/10 px-2 py-1 md:px-3">
            <p className="text-xs md:text-sm font-bold text-primary">
              {asset.price.toLocaleString()}{" "}
              <span className="text-xs">
                {asset.paymentMethod === "riyal" ? "ريال" : asset.paymentMethod === "credit" ? "كريديت" : "Robux"}
              </span>
            </p>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}
