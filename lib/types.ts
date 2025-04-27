export interface Seller {
  id: string
  username: string
  avatar: string
  discordId: string
  badges: string[]
  joinDate: string
  totalSales: number
  listedAssets: number
  averageRating: number
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
