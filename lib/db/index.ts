import { MongoClient, ObjectId } from "mongodb"
import type { User, Asset, Review } from "./models"

const uri = process.env.MONGODB_URI!
const client = new MongoClient(uri)

let isConnected = false

async function connectToDatabase() {
  if (!isConnected) {
    await client.connect()
    isConnected = true
  }
  return client.db("roblox_marketplace")
}

// User functions
export async function getUserById(id: string): Promise<User | null> {
  try {
    const db = await connectToDatabase()
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
    if (!user) return null

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      password: user.password,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const db = await connectToDatabase()
    const user = await db.collection("users").findOne({ email })
    if (!user) return null

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      password: user.password,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
  try {
    const db = await connectToDatabase()
    const now = new Date()

    const result = await db.collection("users").insertOne({
      ...userData,
      createdAt: now,
      updatedAt: now,
    })

    return {
      id: result.insertedId.toString(),
      ...userData,
      createdAt: now,
      updatedAt: now,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("فشل في إنشاء المستخدم")
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const db = await connectToDatabase()
    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) return null

    return {
      id: result._id.toString(),
      name: result.name,
      email: result.email,
      image: result.image,
      password: result.password,
      emailVerified: result.emailVerified,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

// Asset functions
export async function getAssets(filters?: {
  category?: string
  search?: string
  sellerId?: string
  featured?: boolean
  limit?: number
  skip?: number
}): Promise<Asset[]> {
  try {
    const db = await connectToDatabase()
    const query: any = {}

    if (filters?.category && filters.category !== "all") {
      query.category = filters.category
    }

    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ]
    }

    if (filters?.sellerId) {
      query.sellerId = filters.sellerId
    }

    if (filters?.featured) {
      query.featured = true
    }

    let cursor = db.collection("assets").find(query).sort({ createdAt: -1 })

    if (filters?.skip) {
      cursor = cursor.skip(filters.skip)
    }

    if (filters?.limit) {
      cursor = cursor.limit(filters.limit)
    }

    const assets = await cursor.toArray()

    return assets.map((asset) => ({
      id: asset._id.toString(),
      title: asset.title,
      description: asset.description,
      price: asset.price,
      category: asset.category,
      paymentMethod: asset.paymentMethod,
      images: asset.images,
      sellerId: asset.sellerId,
      featured: asset.featured || false,
      rating: asset.rating || 0,
      reviewCount: asset.reviewCount || 0,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    }))
  } catch (error) {
    console.error("Error getting assets:", error)
    return []
  }
}

export async function getAssetById(id: string): Promise<Asset | null> {
  try {
    const db = await connectToDatabase()
    const asset = await db.collection("assets").findOne({ _id: new ObjectId(id) })
    if (!asset) return null

    return {
      id: asset._id.toString(),
      title: asset.title,
      description: asset.description,
      price: asset.price,
      category: asset.category,
      paymentMethod: asset.paymentMethod,
      images: asset.images,
      sellerId: asset.sellerId,
      featured: asset.featured || false,
      rating: asset.rating || 0,
      reviewCount: asset.reviewCount || 0,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    }
  } catch (error) {
    console.error("Error getting asset by ID:", error)
    return null
  }
}

export async function createAsset(
  assetData: Omit<Asset, "id" | "createdAt" | "updatedAt" | "rating" | "reviewCount" | "featured">,
): Promise<Asset> {
  try {
    const db = await connectToDatabase()
    const now = new Date()

    const result = await db.collection("assets").insertOne({
      ...assetData,
      featured: false,
      rating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    })

    return {
      id: result.insertedId.toString(),
      ...assetData,
      featured: false,
      rating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    }
  } catch (error) {
    console.error("Error creating asset:", error)
    throw new Error("فشل في إنشاء المنتج")
  }
}

export async function updateAsset(id: string, updates: Partial<Asset>): Promise<Asset | null> {
  try {
    const db = await connectToDatabase()
    const result = await db.collection("assets").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) return null

    return {
      id: result._id.toString(),
      title: result.title,
      description: result.description,
      price: result.price,
      category: result.category,
      paymentMethod: result.paymentMethod,
      images: result.images,
      sellerId: result.sellerId,
      featured: result.featured || false,
      rating: result.rating || 0,
      reviewCount: result.reviewCount || 0,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }
  } catch (error) {
    console.error("Error updating asset:", error)
    return null
  }
}

export async function deleteAsset(id: string): Promise<boolean> {
  try {
    const db = await connectToDatabase()
    const result = await db.collection("assets").deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting asset:", error)
    return false
  }
}

// Review functions
export async function getReviewsByAssetId(assetId: string): Promise<Review[]> {
  try {
    const db = await connectToDatabase()
    const reviews = await db.collection("reviews").find({ assetId }).sort({ createdAt: -1 }).toArray()

    return reviews.map((review) => ({
      id: review._id.toString(),
      assetId: review.assetId,
      userId: review.userId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    }))
  } catch (error) {
    console.error("Error getting reviews:", error)
    return []
  }
}

export async function getAssetReviews(assetId: string): Promise<Review[]> {
  return getReviewsByAssetId(assetId)
}

export async function createReview(reviewData: Omit<Review, "id" | "createdAt">): Promise<Review> {
  try {
    const db = await connectToDatabase()
    const now = new Date()

    const result = await db.collection("reviews").insertOne({
      ...reviewData,
      createdAt: now,
    })

    // Update asset rating
    await updateAssetRating(reviewData.assetId)

    return {
      id: result.insertedId.toString(),
      ...reviewData,
      createdAt: now,
    }
  } catch (error) {
    console.error("Error creating review:", error)
    throw new Error("فشل في إضافة التقييم")
  }
}

async function updateAssetRating(assetId: string) {
  try {
    const db = await connectToDatabase()
    const reviews = await db.collection("reviews").find({ assetId }).toArray()

    if (reviews.length === 0) return

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    await db.collection("assets").updateOne(
      { _id: new ObjectId(assetId) },
      {
        $set: {
          rating: Math.round(averageRating * 10) / 10,
          reviewCount: reviews.length,
          updatedAt: new Date(),
        },
      },
    )
  } catch (error) {
    console.error("Error updating asset rating:", error)
  }
}

// Image functions
export async function storeImage(imageData: {
  filename: string
  contentType: string
  data: string
  uploadedBy: string
}): Promise<{ id: string }> {
  try {
    const db = await connectToDatabase()
    const now = new Date()

    const result = await db.collection("images").insertOne({
      ...imageData,
      createdAt: now,
    })

    return {
      id: result.insertedId.toString(),
    }
  } catch (error) {
    console.error("Error storing image:", error)
    throw new Error("فشل في تخزين الصورة")
  }
}

export async function getImageById(id: string): Promise<{
  id: string
  filename: string
  contentType: string
  data: string
  uploadedBy: string
  createdAt: Date
} | null> {
  try {
    const db = await connectToDatabase()
    const image = await db.collection("images").findOne({ _id: new ObjectId(id) })
    if (!image) return null

    return {
      id: image._id.toString(),
      filename: image.filename,
      contentType: image.contentType,
      data: image.data,
      uploadedBy: image.uploadedBy,
      createdAt: image.createdAt,
    }
  } catch (error) {
    console.error("Error getting image by ID:", error)
    return null
  }
}

export async function deleteImage(id: string): Promise<boolean> {
  try {
    const db = await connectToDatabase()
    const result = await db.collection("images").deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}

// Email verification functions
export async function createEmailVerificationToken(userId: string, email: string): Promise<string> {
  try {
    const db = await connectToDatabase()
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await db.collection("email_verification_tokens").insertOne({
      token,
      userId,
      email,
      expiresAt,
      createdAt: new Date(),
    })

    return token
  } catch (error) {
    console.error("Error creating email verification token:", error)
    throw new Error("فشل في إنشاء رمز التحقق")
  }
}

export async function verifyEmailToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const db = await connectToDatabase()
    const verification = await db.collection("email_verification_tokens").findOne({
      token,
      expiresAt: { $gt: new Date() },
    })

    if (!verification) return null

    // Delete the token after verification
    await db.collection("email_verification_tokens").deleteOne({ _id: verification._id })

    return {
      userId: verification.userId,
      email: verification.email,
    }
  } catch (error) {
    console.error("Error verifying email token:", error)
    return null
  }
}
