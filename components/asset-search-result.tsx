"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { Asset } from "@/lib/types"

interface AssetSearchResultProps {
  asset: Asset
  onClick: () => void
}

export function AssetSearchResult({ asset, onClick }: AssetSearchResultProps) {
  return (
    <div
      className="flex cursor-pointer items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted"
      onClick={onClick}
    >
      <div className="relative h-12 w-12 overflow-hidden rounded-md">
        <Image src={asset.images[0] || "/placeholder.svg"} alt={asset.title} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{asset.title}</h4>
          <Badge variant="outline">{asset.category}</Badge>
        </div>
        <p className="line-clamp-1 text-sm text-muted-foreground">{asset.description}</p>
      </div>
    </div>
  )
}
