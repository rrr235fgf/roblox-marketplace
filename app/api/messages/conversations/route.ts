import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("roblox_marketplace")

    // جلب جميع المحادثات للمستخدم الحالي
    const messages = await db
      .collection("messages")
      .aggregate([
        {
          $match: {
            $or: [{ senderId: session.user.id }, { receiverId: session.user.id }],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: {
              $cond: [{ $eq: ["$senderId", session.user.id] }, "$receiverId", "$senderId"],
            },
            lastMessage: { $first: "$message" },
            lastMessageAt: { $first: "$createdAt" },
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [{ $eq: ["$receiverId", session.user.id] }, { $eq: ["$isRead", false] }],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ])
      .toArray()

    // جلب معلومات المستخدمين
    const userIds = messages.map((msg) => new ObjectId(msg._id))
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds } })
      .toArray()

    const conversations = messages.map((msg) => {
      const user = users.find((u) => u._id.toString() === msg._id)
      return {
        userId: msg._id,
        userName: user?.name || "مستخدم غير معروف",
        userImage: user?.image || null,
        lastMessage: msg.lastMessage,
        lastMessageAt: msg.lastMessageAt,
        unreadCount: msg.unreadCount,
      }
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
