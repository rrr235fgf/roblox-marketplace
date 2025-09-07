import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { receiverId, message } = await request.json()

    if (!receiverId || !message?.trim()) {
      return NextResponse.json({ error: "البيانات مطلوبة" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("roblox_marketplace")

    // التحقق من وجود المستقبل
    const receiver = await db.collection("users").findOne({ _id: new ObjectId(receiverId) })
    if (!receiver) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    // إنشاء الرسالة
    const now = new Date()
    const result = await db.collection("messages").insertOne({
      senderId: session.user.id,
      receiverId,
      message: message.trim(),
      isRead: false,
      createdAt: now,
    })

    // جلب معلومات المرسل
    const sender = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) })

    return NextResponse.json({
      id: result.insertedId.toString(),
      senderId: session.user.id,
      receiverId,
      message: message.trim(),
      isRead: false,
      createdAt: now,
      senderName: sender?.name || "مستخدم غير معروف",
      senderImage: sender?.image || null,
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
