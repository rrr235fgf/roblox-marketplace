import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  id: string
  username: string
  email?: string
  avatar: string
  password?: string
  discordId?: string // للتوافق مع النظام القديم
  badges: string[]
  joinDate: string
  totalSales: number
  listedAssets: number
  averageRating: number
  emailVerified?: boolean
  createdAt: Date
  updatedAt: Date
  lastAssetCreatedAt?: Date
}

export interface Asset {
  _id?: ObjectId
  id: string
  title: string
  description: string
  price: number
  category: "maps" | "systems" | "games" | "other"
  images: string[]
  rating: number
  ratingCount: number
  sellerId: string
  seller?: User
  featured?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Sale {
  _id?: ObjectId
  id: string
  assetId: string
  asset?: {
    id: string
    title: string
    category: string
    image: string
  }
  buyerId: string
  buyer?: {
    id: string
    username: string
    avatar: string
  }
  sellerId: string
  price: number
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  _id?: ObjectId
  id: string
  assetId: string
  userId: string
  user?: {
    id: string
    username: string
    avatar: string
  }
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

export interface ImageFile {
  _id?: ObjectId
  id: string
  filename: string
  contentType: string
  data: string
  uploadedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface NewsletterSubscription {
  _id?: ObjectId
  id: string
  email: string
  createdAt: Date
}

export interface PrizeAccount {
  _id?: ObjectId
  id: string
  type: "empty" | "bloxfruit" | "medium" | "premium"
  username: string
  password: string
  details?: string
  claimed: boolean
  claimedBy?: string
  claimedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface LuckyWheelSpin {
  _id?: ObjectId
  id: string
  userId: string
  prizeType: "empty" | "bloxfruit" | "medium" | "premium"
  prizeAccountId?: string
  spinTime: Date
  nextSpinTime: Date
  createdAt: Date
  updatedAt: Date
}

// نموذج رموز التحقق من البريد الإلكتروني
export interface EmailVerificationToken {
  _id?: ObjectId
  id: string
  userId: string
  email: string
  token: string
  expiresAt: Date
  createdAt: Date
}

// نموذج رموز إعادة تعيين كلمة المرور
export interface PasswordResetToken {
  _id?: ObjectId
  id: string
  userId: string
  email: string
  token: string
  expiresAt: Date
  createdAt: Date
}
