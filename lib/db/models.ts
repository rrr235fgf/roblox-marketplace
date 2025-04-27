import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  id: string
  username: string
  email?: string
  avatar: string
  discordId: string
  badges: string[]
  joinDate: string
  totalSales: number
  listedAssets: number
  averageRating: number
  createdAt: Date
  updatedAt: Date
  lastAssetCreatedAt?: Date // وقت آخر منتج تم إضافته
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
  data: string // Base64 encoded image data
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

// نموذج حسابات الجوائز
export interface PrizeAccount {
  _id?: ObjectId
  id: string
  type: "empty" | "bloxfruit" | "medium" | "premium" // نوع الحساب
  username: string // اسم المستخدم للحساب
  password: string // كلمة المرور للحساب (مشفرة)
  details?: string // تفاصيل إضافية عن الحساب
  claimed: boolean // هل تم المطالبة بالحساب
  claimedBy?: string // معرف المستخدم الذي حصل على الحساب
  claimedAt?: Date // وقت المطالبة بالحساب
  createdAt: Date
  updatedAt: Date
}

// نموذج سجل عجلة الحظ
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
