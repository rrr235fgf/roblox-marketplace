import type { User, Asset, Sale, Review, PrizeAccount, LuckyWheelSpin } from "./models"
import { getDb } from "./db"

// اسم قاعدة البيانات
const DB_NAME = "Marketplace"

// تحديد شارات المستخدم بناءً على تاريخ التسجيل
export function getUserBadges(joinDate: string, existingBadges: string[] = []): string[] {
  const badges = [
    ...existingBadges.filter(
      (badge) => badge === "مميز" || badge === "مشهور" || badge === "ادارة" || badge === "موثوق",
    ),
  ]

  // إضافة شارة "عضو جديد" إذا لم تكن موجودة بالفعل
  if (
    !badges.includes("عضو جديد") &&
    !badges.includes("عضو نشط") &&
    !badges.includes("عضو متميز") &&
    !badges.includes("عضو محترف")
  ) {
    badges.push("عضو جديد")
  }

  const registrationDate = new Date(joinDate)
  const now = new Date()
  const daysSinceRegistration = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24))

  // تحديث الشارة بناءً على عدد الأيام منذ التسجيل
  if (daysSinceRegistration >= 50) {
    // إزالة الشارات السابقة
    const index = badges.findIndex((badge) => badge === "عضو جديد" || badge === "عضو نشط" || badge === "عضو متميز")
    if (index !== -1) {
      badges.splice(index, 1)
    }
    if (!badges.includes("عضو محترف")) {
      badges.push("عضو محترف")
    }
  } else if (daysSinceRegistration >= 25) {
    const index = badges.findIndex((badge) => badge === "عضو جديد" || badge === "عضو نشط")
    if (index !== -1) {
      badges.splice(index, 1)
    }
    if (!badges.includes("عضو متميز") && !badges.includes("عضو محترف")) {
      badges.push("عضو متميز")
    }
  } else if (daysSinceRegistration >= 5) {
    const index = badges.findIndex((badge) => badge === "عضو جديد")
    if (index !== -1) {
      badges.splice(index, 1)
    }
    if (!badges.includes("عضو نشط") && !badges.includes("عضو متميز") && !badges.includes("عضو محترف")) {
      badges.push("عضو نشط")
    }
  }

  return badges
}

// ==================== وظائف المستخدمين ====================

// إنشاء مستخدم جديد
export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">) {
  try {
    const db = await getDb()
    const now = new Date()

    const newUser = {
      ...userData,
      badges: userData.badges || ["عضو جديد"],
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("users").insertOne(newUser)
    return { ...newUser, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// الحصول على مستخدم بواسطة معرف Discord
export async function getUserByDiscordId(discordId: string) {
  try {
    const db = await getDb()
    const user = await db.collection("users").findOne({ discordId })

    if (user) {
      // تحديث الشارات بناءً على تاريخ التسجيل
      const updatedBadges = getUserBadges(user.joinDate, user.badges)

      // إذا تغيرت الشارات، قم بتحديث المستخدم في قاعدة البيانات
      if (JSON.stringify(updatedBadges) !== JSON.stringify(user.badges)) {
        await db
          .collection("users")
          .updateOne({ discordId }, { $set: { badges: updatedBadges, updatedAt: new Date() } })
        user.badges = updatedBadges
      }
    }

    return user
  } catch (error) {
    console.error("Error getting user by Discord ID:", error)
    return null
  }
}

// الحصول على مستخدم بواسطة المعرف
export async function getUserById(id: string) {
  try {
    const db = await getDb()
    const user = await db.collection("users").findOne({ id })

    if (user) {
      // تحديث الشارات بناءً على تاريخ التسجيل
      const updatedBadges = getUserBadges(user.joinDate, user.badges)

      // إذا تغيرت الشارات، قم بتحديث المستخدم في قاعدة البيانات
      if (JSON.stringify(updatedBadges) !== JSON.stringify(user.badges)) {
        await db.collection("users").updateOne({ id }, { $set: { badges: updatedBadges, updatedAt: new Date() } })
        user.badges = updatedBadges
      }
    }

    return user
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

// تحديث مستخدم
export async function updateUser(id: string, userData: Partial<User>) {
  try {
    const db = await getDb()
    const updateData = {
      ...userData,
      updatedAt: new Date(),
    }

    const result = await db.collection("users").updateOne({ id }, { $set: updateData })

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating user:", error)
    return false
  }
}

// ==================== وظائف الأصول ====================

// إنشاء أصل جديد
export async function createAsset(assetData: Omit<Asset, "_id" | "createdAt" | "updatedAt" | "seller">) {
  try {
    const db = await getDb()
    const now = new Date()

    // التأكد من أن البيانات صالحة
    if (!assetData.id || !assetData.title || !assetData.description || !assetData.sellerId) {
      throw new Error("البيانات غير كاملة")
    }

    // التأكد من أن الصور موجودة وصالحة
    let validImages = Array.isArray(assetData.images)
      ? assetData.images.filter((img) => typeof img === "string" && img.trim() !== "")
      : []

    if (validImages.length === 0) {
      // استخدام صورة افتراضية إذا لم تكن هناك صور صالحة
      validImages = ["/placeholder.svg?height=800&width=600&text=Default+Product+Image"]
    }

    const newAsset = {
      ...assetData,
      images: validImages,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("assets").insertOne(newAsset)

    // تحديث عدد المنتجات المدرجة للبائع
    const seller = await db.collection("users").findOne({ id: assetData.sellerId })
    if (seller) {
      await db
        .collection("users")
        .updateOne(
          { id: assetData.sellerId },
          { $set: { listedAssets: (seller.listedAssets || 0) + 1, updatedAt: now } },
        )
    }

    return { ...newAsset, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating asset:", error)
    throw error
  }
}

// الحصول على جميع الأصول مع خيارات التصفية
export async function getAssets({
  category,
  sellerId,
  searchQuery,
  featured,
  limit = 20,
  skip = 0,
}: {
  category?: string
  sellerId?: string
  searchQuery?: string
  featured?: boolean
  limit?: number
  skip?: number
} = {}) {
  try {
    const db = await getDb()

    // بناء استعلام التصفية
    const filter: any = {}

    if (category) {
      filter.category = category
    }

    if (sellerId) {
      filter.sellerId = sellerId
    }

    if (featured !== undefined) {
      filter.featured = featured
    }

    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ]
    }

    // الحصول على الأصول
    const assets = await db.collection("assets").find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    // الحصول على معلومات البائعين
    const sellerIds = [...new Set(assets.map((asset) => asset.sellerId))]
    const sellers = await db
      .collection("users")
      .find({ id: { $in: sellerIds } })
      .toArray()

    // دمج معلومات البائعين مع الأصول
    const assetsWithSellers = assets.map((asset) => {
      const seller = sellers.find((s) => s.id === asset.sellerId)

      // التأكد من أن الصور موجودة وصالحة
      let validImages = Array.isArray(asset.images)
        ? asset.images.filter((img) => typeof img === "string" && img.trim() !== "")
        : []

      if (validImages.length === 0) {
        validImages = ["/placeholder.svg?height=800&width=600&text=Default+Product+Image"]
      }

      return {
        ...asset,
        images: validImages,
        seller: seller
          ? {
              id: seller.id,
              username: seller.username,
              avatar: seller.avatar || "/placeholder.svg",
              badges: seller.badges || [],
              discordId: seller.discordId,
            }
          : {
              id: "unknown",
              username: "مستخدم غير معروف",
              avatar: "/placeholder.svg",
              badges: [],
              discordId: "",
            },
      }
    })

    return assetsWithSellers
  } catch (error) {
    console.error("Error getting assets:", error)
    return []
  }
}

// الحصول على أصل بواسطة المعرف
export async function getAssetById(id: string) {
  try {
    const db = await getDb()
    const asset = await db.collection("assets").findOne({ id })

    if (!asset) {
      return null
    }

    // الحصول على معلومات البائع
    const seller = await db.collection("users").findOne({ id: asset.sellerId })

    // التأكد من أن الصور موجودة وصالحة
    let validImages = Array.isArray(asset.images)
      ? asset.images.filter((img) => typeof img === "string" && img.trim() !== "")
      : []

    if (validImages.length === 0) {
      validImages = ["/placeholder.svg?height=800&width=600&text=Default+Product+Image"]
    }

    return {
      ...asset,
      images: validImages,
      seller: seller
        ? {
            id: seller.id,
            username: seller.username,
            avatar: seller.avatar || "/placeholder.svg",
            badges: seller.badges || [],
            discordId: seller.discordId,
          }
        : {
            id: "unknown",
            username: "مستخدم غير معروف",
            avatar: "/placeholder.svg",
            badges: [],
            discordId: "",
          },
    }
  } catch (error) {
    console.error("Error getting asset by ID:", error)
    return null
  }
}

// تحديث أصل
export async function updateAsset(id: string, assetData: Partial<Asset>) {
  try {
    const db = await getDb()

    // التأكد من أن الصور موجودة وصالحة إذا تم تقديمها
    if (assetData.images) {
      const validImages = Array.isArray(assetData.images)
        ? assetData.images.filter((img) => typeof img === "string" && img.trim() !== "")
        : []

      if (validImages.length === 0) {
        validImages.push("/placeholder.svg?height=800&width=600&text=Default+Product+Image")
      }

      assetData.images = validImages
    }

    const updateData = {
      ...assetData,
      updatedAt: new Date(),
    }

    const result = await db.collection("assets").updateOne({ id }, { $set: updateData })

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating asset:", error)
    return false
  }
}

// حذف أصل
export async function deleteAsset(id: string) {
  try {
    const db = await getDb()

    // الحصول على معلومات الأصل قبل الحذف
    const asset = await db.collection("assets").findOne({ id })

    if (asset) {
      // تحديث عدد المنتجات المدرجة للبائع
      const seller = await db.collection("users").findOne({ id: asset.sellerId })
      if (seller && seller.listedAssets > 0) {
        await db
          .collection("users")
          .updateOne({ id: asset.sellerId }, { $set: { listedAssets: seller.listedAssets - 1, updatedAt: new Date() } })
      }
    }

    const result = await db.collection("assets").deleteOne({ id })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting asset:", error)
    return false
  }
}

// ==================== وظائف المبيعات ====================

// إنشاء عملية بيع جديدة
export async function createSale(saleData: Omit<Sale, "_id" | "createdAt" | "updatedAt" | "asset" | "buyer">) {
  try {
    const db = await getDb()
    const now = new Date()

    const newSale = {
      ...saleData,
      date: new Date(saleData.date),
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("sales").insertOne(newSale)

    // تحديث عدد المبيعات للبائع
    const seller = await db.collection("users").findOne({ id: saleData.sellerId })
    if (seller) {
      await db
        .collection("users")
        .updateOne({ id: saleData.sellerId }, { $set: { totalSales: (seller.totalSales || 0) + 1, updatedAt: now } })
    }

    return { ...newSale, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating sale:", error)
    throw error
  }
}

// الحصول على أحدث المبيعات
export async function getRecentSales(limit = 5) {
  try {
    const db = await getDb()

    const sales = await db.collection("sales").find().sort({ date: -1 }).limit(limit).toArray()

    // الحصول على معلومات الأصول والمشترين
    const assetIds = [...new Set(sales.map((sale) => sale.assetId))]
    const buyerIds = [...new Set(sales.map((sale) => sale.buyerId))]

    const assets = await db
      .collection("assets")
      .find({ id: { $in: assetIds } })
      .toArray()

    const buyers = await db
      .collection("users")
      .find({ id: { $in: buyerIds } })
      .toArray()

    // دمج المعلومات
    const salesWithDetails = sales.map((sale) => {
      const asset = assets.find((a) => a.id === sale.assetId)
      const buyer = buyers.find((b) => b.id === sale.buyerId)

      return {
        ...sale,
        asset: asset
          ? {
              id: asset.id,
              title: asset.title,
              category: asset.category,
              image: Array.isArray(asset.images) && asset.images.length > 0 ? asset.images[0] : "/placeholder.svg",
            }
          : {
              id: "unknown",
              title: "منتج غير معروف",
              category: "other",
              image: "/placeholder.svg",
            },
        buyer: buyer
          ? {
              id: buyer.id,
              username: buyer.username,
              avatar: buyer.avatar || "/placeholder.svg",
            }
          : {
              id: "unknown",
              username: "مستخدم غير معروف",
              avatar: "/placeholder.svg",
            },
      }
    })

    return salesWithDetails
  } catch (error) {
    console.error("Error getting recent sales:", error)
    return []
  }
}

// ==================== وظائف التقييمات ====================

// إنشاء تقييم جديد
export async function createReview(reviewData: Omit<Review, "_id" | "createdAt" | "updatedAt" | "user">) {
  try {
    const db = await getDb()
    const now = new Date()

    const newReview = {
      ...reviewData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("reviews").insertOne(newReview)

    // تحديث تقييم الأصل
    const asset = await db.collection("assets").findOne({ id: reviewData.assetId })
    if (asset) {
      const totalRating = asset.rating * asset.ratingCount + reviewData.rating
      const newRatingCount = asset.ratingCount + 1
      const newRating = totalRating / newRatingCount

      await db
        .collection("assets")
        .updateOne(
          { id: reviewData.assetId },
          { $set: { rating: newRating, ratingCount: newRatingCount, updatedAt: now } },
        )
    }

    return { ...newReview, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating review:", error)
    throw error
  }
}

// الحصول على تقييمات أصل
export async function getAssetReviews(assetId: string) {
  try {
    const db = await getDb()

    const reviews = await db.collection("reviews").find({ assetId }).toArray()

    // الحصول على معلومات المستخدمين
    const userIds = [...new Set(reviews.map((review) => review.userId))]
    const users = await db
      .collection("users")
      .find({ id: { $in: userIds } })
      .toArray()

    // دمج المعلومات
    const reviewsWithDetails = reviews.map((review) => {
      const user = users.find((u) => u.id === review.userId)

      return {
        ...review,
        user: user
          ? {
              id: user.id,
              username: user.username,
              avatar: user.avatar || "/placeholder.svg",
            }
          : {
              id: "unknown",
              username: "مستخدم غير معروف",
              avatar: "/placeholder.svg",
            },
      }
    })

    return reviewsWithDetails
  } catch (error) {
    console.error("Error getting asset reviews:", error)
    return []
  }
}

// ==================== وظائف الصور ====================

// تخزين صورة جديدة
export async function storeImage(imageData: {
  filename: string
  contentType: string
  data: string // Base64 encoded image data
  uploadedBy: string
}) {
  try {
    const db = await getDb()
    const now = new Date()
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)

    const newImage = {
      id,
      filename: imageData.filename,
      contentType: imageData.contentType,
      data: imageData.data,
      uploadedBy: imageData.uploadedBy,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("images").insertOne(newImage)
    return { ...newImage, _id: result.insertedId }
  } catch (error) {
    console.error("Error storing image:", error)
    throw error
  }
}

// الحصول على صورة بواسطة المعرف
export async function getImageById(id: string) {
  try {
    const db = await getDb()
    const image = await db.collection("images").findOne({ id })
    return image
  } catch (error) {
    console.error("Error getting image by ID:", error)
    return null
  }
}

// حذف صورة
export async function deleteImage(id: string) {
  try {
    const db = await getDb()
    const result = await db.collection("images").deleteOne({ id })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}

// ==================== وظائف حسابات الجوائز ====================

// إنشاء حساب جائزة جديد
export async function createPrizeAccount(
  accountData: Omit<PrizeAccount, "_id" | "createdAt" | "updatedAt" | "claimed" | "claimedBy" | "claimedAt">,
) {
  try {
    const db = await getDb()
    const now = new Date()
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)

    const newAccount = {
      ...accountData,
      id,
      claimed: false,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("prizeAccounts").insertOne(newAccount)
    return { ...newAccount, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating prize account:", error)
    throw error
  }
}

// الحصول على حساب جائزة غير مطالب به بواسطة النوع
export async function getUnclaimedPrizeAccountByType(type: "empty" | "bloxfruit" | "medium" | "premium") {
  try {
    const db = await getDb()
    const account = await db.collection("prizeAccounts").findOne({ type, claimed: false })
    return account
  } catch (error) {
    console.error("Error getting unclaimed prize account:", error)
    return null
  }
}

// المطالبة بحساب جائزة
export async function claimPrizeAccount(accountId: string, userId: string) {
  try {
    const db = await getDb()
    const now = new Date()

    const result = await db
      .collection("prizeAccounts")
      .updateOne(
        { id: accountId, claimed: false },
        { $set: { claimed: true, claimedBy: userId, claimedAt: now, updatedAt: now } },
      )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error claiming prize account:", error)
    return false
  }
}

// الحصول على حسابات الجوائز المطالب بها من قبل مستخدم
export async function getUserClaimedPrizeAccounts(userId: string) {
  try {
    const db = await getDb()
    const accounts = await db.collection("prizeAccounts").find({ claimedBy: userId }).toArray()
    return accounts
  } catch (error) {
    console.error("Error getting user claimed prize accounts:", error)
    return []
  }
}

// الحصول على جميع حسابات الجوائز (للمسؤولين)
export async function getAllPrizeAccounts() {
  try {
    const db = await getDb()
    const accounts = await db.collection("prizeAccounts").find().sort({ createdAt: -1 }).toArray()
    return accounts
  } catch (error) {
    console.error("Error getting all prize accounts:", error)
    return []
  }
}

// ==================== وظائف سجل عجلة الحظ ====================

// تسجيل دوران عجلة الحظ
export async function recordLuckyWheelSpin(spinData: Omit<LuckyWheelSpin, "_id" | "createdAt" | "updatedAt">) {
  try {
    const db = await getDb()
    const now = new Date()

    const newSpin = {
      ...spinData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("luckyWheelSpins").insertOne(newSpin)
    return { ...newSpin, _id: result.insertedId }
  } catch (error) {
    console.error("Error recording lucky wheel spin:", error)
    throw error
  }
}

// الحصول على آخر دوران لعجلة الحظ للمستخدم
export async function getLastUserLuckyWheelSpin(userId: string) {
  try {
    const db = await getDb()
    const spin = await db.collection("luckyWheelSpins").findOne({ userId }, { sort: { spinTime: -1 } })
    return spin
  } catch (error) {
    console.error("Error getting last user lucky wheel spin:", error)
    return null
  }
}

// التحقق مما إذا كان المستخدم يمكنه الدوران
export async function canUserSpin(userId: string) {
  try {
    const lastSpin = await getLastUserLuckyWheelSpin(userId)
    if (!lastSpin) return true

    const now = new Date()
    return now >= new Date(lastSpin.nextSpinTime)
  } catch (error) {
    console.error("Error checking if user can spin:", error)
    return false
  }
}
