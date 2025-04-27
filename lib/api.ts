// الوظائف المساعدة للتعامل مع API

// الحصول على جميع المنتجات
export async function getAssets({
  category,
  sellerId,
  searchQuery,
}: {
  category?: string
  sellerId?: string
  searchQuery?: string
} = {}) {
  try {
    let url = "/api/assets?"

    if (category) {
      url += `category=${category}&`
    }

    if (sellerId) {
      url += `sellerId=${sellerId}&`
    }

    if (searchQuery) {
      url += `search=${encodeURIComponent(searchQuery)}&`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("فشل جلب المنتجات")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching assets:", error)
    return []
  }
}

// الحصول على المنتجات المميزة
export async function getFeaturedAssets() {
  try {
    const response = await fetch("/api/assets?featured=true")

    if (!response.ok) {
      throw new Error("فشل جلب المنتجات المميزة")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching featured assets:", error)
    return []
  }
}

// الحصول على منتج بواسطة المعرف
export async function getAssetById(id: string) {
  try {
    const response = await fetch(`/api/assets/${id}`)

    if (!response.ok) {
      throw new Error("فشل جلب المنتج")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching asset:", error)
    return null
  }
}

// إنشاء منتج جديد
export async function createAsset(assetData: {
  title: string
  description: string
  price: number
  category: string
  images: string[]
  sellerId: string
}) {
  try {
    // التحقق من البيانات قبل الإرسال
    if (
      !assetData.title ||
      !assetData.description ||
      !assetData.price ||
      !assetData.category ||
      !assetData.images ||
      assetData.images.length === 0 ||
      !assetData.sellerId
    ) {
      throw new Error("جميع الحقول مطلوبة")
    }

    // إضافة معالجة أخطاء أفضل
    const response = await fetch("/api/assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "فشل إنشاء المنتج")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating asset:", error)
    throw error
  }
}

// تحديث منتج
export async function updateAsset(
  id: string,
  assetData: {
    title?: string
    description?: string
    price?: number
    category?: string
    images?: string[]
  },
) {
  try {
    const response = await fetch(`/api/assets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetData),
    })

    if (!response.ok) {
      throw new Error("فشل تحديث المنتج")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating asset:", error)
    throw error
  }
}

// حذف منتج
export async function deleteAsset(id: string) {
  try {
    const response = await fetch(`/api/assets/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("فشل حذف المنتج")
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting asset:", error)
    throw error
  }
}

// البحث عن المنتجات
export async function searchAssets(query: string) {
  try {
    const response = await fetch(`/api/assets?search=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error("فشل البحث عن المنتجات")
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching assets:", error)
    return []
  }
}

// الحصول على أحدث المبيعات
export async function getRecentSales() {
  try {
    const response = await fetch("/api/sales")

    if (!response.ok) {
      throw new Error("فشل جلب أحدث المبيعات")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching recent sales:", error)
    return []
  }
}

// الحصول على ملف المستخدم
export async function getUserProfile(id: string) {
  try {
    const response = await fetch(`/api/profile/${id}`)

    if (!response.ok) {
      throw new Error("فشل جلب ملف المستخدم")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

// الحصول على الملف الشخصي للمستخدم الحالي
export async function getCurrentUserProfile() {
  try {
    const response = await fetch("/api/profile")

    if (!response.ok) {
      throw new Error("فشل جلب الملف الشخصي")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching current user profile:", error)
    return null
  }
}

// تحديث الملف الشخصي للمستخدم الحالي
export async function updateUserProfile(profileData: {
  username?: string
  // يمكن إضافة المزيد من الحقول هنا
}) {
  try {
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error("فشل تحديث الملف الشخصي")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// إضافة تقييم جديد
export async function addReview(reviewData: {
  assetId: string
  rating: number
  comment: string
}) {
  try {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      throw new Error("فشل إضافة التقييم")
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding review:", error)
    throw error
  }
}

// الحصول على تقييمات منتج
export async function getAssetReviews(assetId: string) {
  try {
    const response = await fetch(`/api/reviews?assetId=${assetId}`)

    if (!response.ok) {
      throw new Error("فشل جلب التقييمات")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching asset reviews:", error)
    return []
  }
}

// إضافة إعجاب لمنتج
export async function likeAsset(assetId: string) {
  try {
    const response = await fetch(`/api/like/${assetId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("فشل إضافة إعجاب")
    }

    return await response.json()
  } catch (error) {
    console.error("Error liking asset:", error)
    throw error
  }
}
