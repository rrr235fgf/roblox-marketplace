export interface User {
  id: string
  name: string
  email: string
  image?: string | null
  password?: string
  emailVerified?: Date | null
  createdAt: Date
  updatedAt: Date
  likes?: number
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

export interface ProfileLike {
  id: string
  profileId: string
  userId: string
  createdAt: Date
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  message: string
  isRead: boolean
  createdAt: Date
}

export interface ChatConversation {
  id: string
  participants: string[]
  lastMessage?: string
  lastMessageAt?: Date
  unreadCount: { [userId: string]: number }
}
