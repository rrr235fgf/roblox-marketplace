export interface Seller {
  id: string
  username: string
  avatar: string
  badges: string[]
  joinDate: string
  createdAt?: string
  totalSales: number
  listedAssets: number
  averageRating: number
  likes?: number
}

export interface Asset {
  id: string
  title: string
  description: string
  price: number
  category: string
  paymentMethod: "robux" | "riyal" | "credit"
  images: string[]
  rating: number
  ratingCount: number
  seller: Seller
  createdAt: string
}

export interface Sale {
  id: string
  asset: {
    id: string
    title: string
    category: string
    image: string
  }
  buyer: {
    id: string
    username: string
    avatar: string
  }
  price: number
  date: string
}
