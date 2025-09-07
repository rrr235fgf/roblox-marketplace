import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { id } = params
    const userId = session.user.id

    if (userId === id) {
      return NextResponse.json({ error: "لا يمكنك الإعجاب بملفك الشخصي" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("roblox_marketplace")

    // التحقق من وجود الإعجاب
    const existingLike = await db.collection("profile_likes").findOne({
      profileId: id,
      userId: userId,
    })

    let isLiked = false
    let likesCount = 0

    if (existingLike) {
      // إلغاء الإعجاب
      await db.collection("profile_likes").deleteOne({
        profileId: id,
        userId: userId,
      })

      await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $inc: { likes: -1 } })

      isLiked = false
    } else {
      // إضافة إعجاب
      await db.collection("profile_likes").insertOne({
        profileId: id,
        userId: userId,
        createdAt: new Date(),
      })

      await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $inc: { likes: 1 } })

      isLiked = true
    }

    // الحصول على العدد الجديد للإعجابات
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
    likesCount = user?.likes || 0

    return NextResponse.json({ isLiked, likesCount })
  } catch (error) {
    console.error("Error handling like:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
