import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { userId } = params

    await client.connect()
    const db = client.db("roblox_marketplace")

    // جلب الرسائل بين المستخدمين
    const messages = await db
      .collection("messages")
      .find({
        $or: [
          { senderId: session.user.id, receiverId: userId },
          { senderId: userId, receiverId: session.user.id },
        ],
      })
      .sort({ createdAt: 1 })
      .toArray()

    // تحويل ObjectId إلى string
    const formattedMessages = messages.map((message) => ({
      id: message._id.toString(),
      senderId: message.senderId,
      receiverId: message.receiverId,
      message: message.content,
      isRead: message.read,
      createdAt: message.createdAt.toISOString(),
      senderName: message.senderName || "مستخدم",
      senderImage: message.senderImage,
    }))

    return NextResponse.json(formattedMessages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  } finally {
    await client.close()
  }
}
