import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("roblox_marketplace")

    // جلب آخر رسالة لكل محادثة
    const conversations = await db
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
            lastMessage: { $first: "$content" },
            lastMessageTime: { $first: "$createdAt" },
            messages: { $push: "$$ROOT" },
          },
        },
      ])
      .toArray()

    // جلب معلومات المستخدمين وحساب الرسائل غير المقروءة
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conv) => {
        const user = await db.collection("users").findOne({
          _id: new ObjectId(conv._id),
        })

        // حساب الرسائل غير المقروءة
        const unreadCount = await db.collection("messages").countDocuments({
          senderId: conv._id,
          receiverId: session.user.id,
          read: false,
        })

        return {
          userId: conv._id,
          userName: user?.name || "مستخدم غير معروف",
          userImage: user?.image || null,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime,
          unreadCount,
        }
      }),
    )

    return NextResponse.json({
      conversations: conversationsWithUsers.sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime(),
      ),
    })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  } finally {
    await client.close()
  }
}
