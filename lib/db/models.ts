import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  id: string
  username: string
  email: string
  password?: string // للحسابات المحلية
  avatar: string
  badges: string[]
  joinDate: string
  totalSales: number
  listedAssets: number
  averageRating: number
  emailVerified: boolean
  discordId?: string // للتوافق مع النظام القديم
  createdAt: Date
  updatedAt: Date
}

export interface Asset {
  _id?: ObjectId
  id: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  sellerId: string
  seller?: {
    id: string
    username: string
    avatar: string
    badges: string[]
    discordId: string
  }
  featured: boolean
  rating: number
  ratingCount: number
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
  amount: number
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

export interface PrizeAccount {
  _id?: ObjectId
  id: string
  type: "empty" | "bloxfruit" | "medium" | "premium"
  username: string
  password: string
  description: string
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
  deviceId: string
  prize: string
  spinTime: Date
  nextSpinTime: Date
  createdAt: Date
  updatedAt: Date
}

export interface Image {
  _id?: ObjectId
  id: string
  filename: string
  contentType: string
  data: string
  uploadedBy: string
  createdAt: Date
  updatedAt: Date
}
