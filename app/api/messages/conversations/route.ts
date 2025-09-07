import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("roblox_marketplace")

    // جلب المحادثات
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
            lastMessageAt: { $first: "$createdAt" },
            messages: { $push: "$$ROOT" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            userId: "$_id",
            userName: "$user.name",
            userImage: "$user.image",
            lastMessage: 1,
            lastMessageAt: 1,
            unreadCount: {
              $size: {
                $filter: {
                  input: "$messages",
                  cond: {
                    $and: [{ $eq: ["$$this.receiverId", session.user.id] }, { $eq: ["$$this.read", false] }],
                  },
                },
              },
            },
          },
        },
        {
          $sort: { lastMessageAt: -1 },
        },
      ])
      .toArray()

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  } finally {
    await client.close()
  }
}
