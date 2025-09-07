import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { checkProfileLike } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ isLiked: false })
    }

    const isLiked = await checkProfileLike(params.id, session.user.id)
    return NextResponse.json({ isLiked })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json({ isLiked: false })
  }
}
