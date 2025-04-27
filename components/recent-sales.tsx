"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getRecentSales } from "@/lib/api"
import type { Sale } from "@/lib/types"
import Image from "next/image"

export function RecentSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true)
        setError(null)
        const salesData = await getRecentSales()
        setSales(salesData)
      } catch (error) {
        console.error("Error fetching recent sales:", error)
        setError("فشل جلب أحدث المبيعات")
        // استخدام بيانات وهمية في حالة الخطأ
        setSales([])
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>المبيعات الأخيرة</CardTitle>
        <CardDescription>آخر المنتجات التي تم بيعها في السوق</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">لا توجد مبيعات حديثة للعرض</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">لا توجد مبيعات حديثة للعرض</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <div key={sale.id} className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-md">
                  <Image
                    src={sale.asset?.image || "/placeholder.svg"}
                    alt={sale.asset?.title || "منتج"}
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
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link href={`/assets/${sale.asset?.id || "#"}`} className="font-medium hover:underline">
                      {sale.asset?.title || "منتج غير معروف"}
                    </Link>
                    <Badge variant="outline">{sale.asset?.category || "أخرى"}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="relative h-4 w-4 overflow-hidden rounded-full">
                        <Image
                          src={sale.buyer?.avatar || "/placeholder.svg"}
                          alt={sale.buyer?.username || "مستخدم"}
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
                      <span>{sale.buyer?.username || "مستخدم غير معروف"}</span>
                    </div>
                    <span>{sale.price} Robux</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
