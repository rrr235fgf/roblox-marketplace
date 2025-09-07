import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, image } = body

    // التحقق من البيانات
    if (!name || !email || !password) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("roblox_marketplace")

    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // التعامل مع الصورة - رابط فقط أو صورة افتراضية
    let processedImage = "/default-avatar.png" // ضع صورة افتراضية في public
    if (image && (image.startsWith("http://") || image.startsWith("https://"))) {
      processedImage = image
    }

    const now = new Date()
    const result = await db.collection("users").insertOne({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      image: processedImage,
      emailVerified: now,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",
      userId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  } finally {
    try {
      await client.close()
    } catch (e) {
      console.error("Error closing connection:", e)
    }
  }
}
