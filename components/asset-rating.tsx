import { Star } from "lucide-react"

interface AssetRatingProps {
  rating: number
  size?: "sm" | "md"
}

export function AssetRating({ rating, size = "sm" }: AssetRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5"

  return (
    <div className="flex">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${starSize} fill-primary text-primary`} />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <span className="relative">
          <Star className={`${starSize} text-muted-foreground`} />
          <Star className={`${starSize} absolute inset-0 fill-primary text-primary [clip-path:inset(0_50%_0_0)]`} />
        </span>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${starSize} text-muted-foreground`} />
      ))}
    </div>
  )
}
