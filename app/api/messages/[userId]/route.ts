import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("roblox_marketplace")

    // جلب الرسائل بين المستخدمين
    const messages = await db
      .collection("messages")
      .find({
        $or: [
          { senderId: session.user.id, receiverId: params.userId },
          { senderId: params.userId, receiverId: session.user.id },
        ],
      })
      .sort({ createdAt: 1 })
      .toArray()

    // جلب معلومات المرسلين
    const senderIds = [...new Set(messages.map((msg) => msg.senderId))]
    const users = await db
      .collection("users")
      .find({ _id: { $in: senderIds.map((id) => new ObjectId(id)) } })
      .toArray()

    const messagesWithSenderInfo = messages.map((msg) => {
      const sender = users.find((u) => u._id.toString() === msg.senderId)
      return {
        id: msg._id.toString(),
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        message: msg.message,
        isRead: msg.isRead,
        createdAt: msg.createdAt,
        senderName: sender?.name || "مستخدم غير معروف",
        senderImage: sender?.image || null,
      }
    })

    return NextResponse.json(messagesWithSenderInfo)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
