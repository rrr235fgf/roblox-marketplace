import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { userId } = params

    await client.connect()
    const db = client.db("roblox_marketplace")

    // تحديد الرسائل كمقروءة
    await db.collection("messages").updateMany(
      {
        senderId: userId,
        receiverId: session.user.id,
        read: false,
      },
      {
        $set: { read: true },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  } finally {
    await client.close()
  }
}
