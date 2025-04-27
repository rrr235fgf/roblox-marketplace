"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { searchAssets } from "@/lib/api"
import type { Asset } from "@/lib/types"
import { AssetSearchResult } from "@/components/asset-search-result"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Asset[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length > 2) {
        handleSearch()
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleSearch = async () => {
    if (query.trim().length < 3) return

    setIsSearching(true)
    try {
      const searchResults = await searchAssets(query)
      setResults(searchResults)
    } catch (error) {
      console.error("Error searching assets:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultClick = (assetId: string) => {
    router.push(`/assets/${assetId}`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>البحث عن المنتجات</DialogTitle>
          <DialogDescription>ابحث عن المنتجات حسب الاسم أو الوصف أو الفئة</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن المنتجات..."
            className="pr-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {isSearching ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((asset) => (
                <AssetSearchResult key={asset.id} asset={asset} onClick={() => handleResultClick(asset.id)} />
              ))}
            </div>
          ) : query.trim().length > 2 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
              <p className="text-lg font-medium">لا توجد نتائج</p>
              <p className="text-sm text-muted-foreground">لم يتم العثور على منتجات تطابق "{query}"</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
