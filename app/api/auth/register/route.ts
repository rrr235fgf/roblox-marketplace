import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

// دالة لضغط الصورة
function compressImage(base64Image: string, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // تحديد الحد الأقصى للأبعاد
      const maxWidth = 300
      const maxHeight = 300

      let { width, height } = img

      // حساب الأبعاد الجديدة مع الحفاظ على النسبة
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // رسم الصورة المضغوطة
      ctx?.drawImage(img, 0, 0, width, height)

      // تحويل إلى base64 مع ضغط
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality)
      resolve(compressedBase64)
    }

    img.src = base64Image
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, image } = body

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

    // معالجة الصورة بطريقة محسنة
    let processedImage = "/placeholder-user.jpg" // صورة افتراضية

    if (image && typeof image === "string" && image.trim()) {
      try {
        // التحقق من أن الصورة base64 صالحة
        if (image.startsWith("data:image/")) {
          // التحقق من حجم الصورة (أقل من 5MB)
          const base64Data = image.split(",")[1]
          const sizeInBytes = (base64Data.length * 3) / 4
          const sizeInMB = sizeInBytes / (1024 * 1024)

          if (sizeInMB > 5) {
            console.log("Image too large, using default")
          } else {
            // حفظ الصورة مباشرة كـ base64 (مؤقتاً)
            processedImage = image
          }
        }
        // إذا كانت رابط URL صالح
        else if (image.startsWith("http://") || image.startsWith("https://")) {
          // التحقق من أن الرابط يشير إلى صورة
          if (image.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
            processedImage = image
          }
        }
      } catch (error) {
        console.error("Error processing image:", error)
        // في حالة الخطأ، استخدم الصورة الافتراضية
      }
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
