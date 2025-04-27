"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface ImageWithFallbackProps extends Omit<ImageProps, "src" | "onError"> {
  src: string
  fallbackSrc?: string
  alt: string
}

export function ImageWithFallback({
  src,
  fallbackSrc = "/api/placeholder?text=Image",
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  return (
    <Image
      {...props}
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      onError={handleError}
      unoptimized={true} // Esto evita la optimización de Next.js que podría causar problemas
    />
  )
}
