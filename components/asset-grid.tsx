"use client"

import { useEffect, useState } from "react"
import { AssetCard } from "@/components/asset-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getAssets } from "@/lib/api"
import type { Asset } from "@/lib/types"

interface AssetGridProps {
  category?: string
  sellerId?: string
  searchQuery?: string
}

export function AssetGrid({ category, sellerId, searchQuery }: AssetGridProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true)
        setError(null)
        const assetsData = await getAssets({ category, sellerId, searchQuery })

        // التأكد من أن البيانات المستلمة صالحة
        if (Array.isArray(assetsData)) {
          setAssets(assetsData)
        } else {
          console.error("Invalid assets data received:", assetsData)
          setAssets([])
          setError("تعذر تحميل المنتجات. الرجاء المحاولة مرة أخرى.")
        }
      } catch (error) {
        console.error("Error fetching assets:", error)
        setAssets([])
        setError("حدث خطأ أثناء تحميل المنتجات. الرجاء المحاولة مرة أخرى.")
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [category, sellerId, searchQuery])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
        <p className="text-lg font-medium text-destructive">{error}</p>
        <p className="text-sm text-muted-foreground">يرجى تحديث الصفحة أو المحاولة مرة أخرى لاحقًا.</p>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
        <p className="text-lg font-medium">لا توجد منتجات</p>
        <p className="text-sm text-muted-foreground">لم يتم العثور على منتجات تطابق معايير البحث</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  )
}
