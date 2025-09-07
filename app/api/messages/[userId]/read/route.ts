import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("roblox_marketplace")

    // تحديد جميع الرسائل من المستخدم المحدد كمقروءة
    await db.collection("messages").updateMany(
      {
        senderId: params.userId,
        receiverId: session.user.id,
        isRead: false,
      },
      {
        $set: { isRead: true },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
