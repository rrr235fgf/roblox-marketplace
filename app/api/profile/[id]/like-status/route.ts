import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ isLiked: false })
    }

    const { id } = params
    const userId = session.user.id

    await client.connect()
    const db = client.db("roblox_marketplace")

    const existingLike = await db.collection("profile_likes").findOne({
      profileId: id,
      userId: userId,
    })

    return NextResponse.json({ isLiked: !!existingLike })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json({ isLiked: false })
  }
}
