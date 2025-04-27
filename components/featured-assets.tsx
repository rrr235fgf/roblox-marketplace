"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AssetCard } from "@/components/asset-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getFeaturedAssets } from "@/lib/api"
import type { Asset } from "@/lib/types"
import { motion } from "framer-motion"

export function FeaturedAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const featuredAssets = await getFeaturedAssets()
        setAssets(featuredAssets)
      } catch (error) {
        console.error("Error fetching featured assets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  const checkScrollable = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollable)
      // Initial check
      checkScrollable()

      return () => container.removeEventListener("scroll", checkScrollable)
    }
  }, [assets])

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">منتجات مميزة</h2>
            <Button asChild variant="ghost" className="gap-1">
              <Link href="/assets">
                عرض الكل
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground">اكتشف أفضل المنتجات المميزة في سوقنا</p>
        </motion.div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -left-4 top-1/2 z-10 flex -translate-y-1/2 md:-left-6">
              <Button
                variant="outline"
                size="icon"
                className={`h-10 w-10 rounded-full bg-background shadow-md ${
                  !canScrollLeft ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">السابق</span>
              </Button>
            </div>

            <div
              ref={containerRef}
              className="flex gap-6 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x"
              onScroll={checkScrollable}
            >
              {assets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="min-w-[280px] max-w-[280px] snap-start"
                >
                  <AssetCard asset={asset} />
                </motion.div>
              ))}
            </div>

            <div className="absolute -right-4 top-1/2 z-10 flex -translate-y-1/2 md:-right-6">
              <Button
                variant="outline"
                size="icon"
                className={`h-10 w-10 rounded-full bg-background shadow-md ${
                  !canScrollRight ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">التالي</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
