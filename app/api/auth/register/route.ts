import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, image } = await request.json()

    // التحقق من البيانات
    if (!name || !email || !password) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("roblox_marketplace")

    // التحقق من وجود المستخدم
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 400 })
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12)

    // إنشاء المستخدم
    const now = new Date()
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      image: image || null,
      emailVerified: now, // تفعيل تلقائي
      likes: 0,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json({
      success: true,
      userId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
