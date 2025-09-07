import { type NextRequest, NextResponse } from "next/server"
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

    const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) })
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      likes: user.likes || 0,
      socialAccounts: user.socialAccounts || {
        discord: null,
        tiktok: null,
        instagram: null,
      },
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const body = await request.json()
    const { socialAccounts } = body

    // التحقق من وجود حساب واحد على الأقل
    if (!socialAccounts.discord && !socialAccounts.tiktok && !socialAccounts.instagram) {
      return NextResponse.json({ error: "يجب إضافة حساب واحد على الأقل من منصات التواصل الاجتماعي" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("roblox_marketplace")

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          socialAccounts: {
            discord: socialAccounts.discord || null,
            tiktok: socialAccounts.tiktok || null,
            instagram: socialAccounts.instagram || null,
          },
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
