export interface User {
  id: string
  name: string
  email: string
  image?: string | null
  password?: string
  emailVerified?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Asset {
  id: string
  title: string
  description: string
  price: number
  category: "mm2" | "bloxfruit" | "timewar" | "robux" | "accounts" | "development" | "other"
  paymentMethod: "robux" | "riyal" | "credit"
  images: string[]
  sellerId: string
  featured: boolean
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  assetId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
}

export interface Newsletter {
  id: string
  email: string
  createdAt: Date
}
