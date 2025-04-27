"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  // تحميل المفضلة من localStorage عند تحميل المكون
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  // حفظ المفضلة في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  // إضافة أو إزالة منتج من المفضلة
  const toggleFavorite = (assetId: string) => {
    setFavorites((prev) => {
      if (prev.includes(assetId)) {
        return prev.filter((id) => id !== assetId)
      } else {
        return [...prev, assetId]
      }
    })
  }

  // التحقق مما إذا كان المنتج في المفضلة
  const isFavorite = (assetId: string) => {
    return favorites.includes(assetId)
  }

  return { favorites, toggleFavorite, isFavorite }
}
