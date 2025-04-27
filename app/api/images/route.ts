import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { storeImage } from "@/lib/db"

// تحميل صورة جديدة
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لتحميل الصور" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "لم يتم تقديم ملف" }, { status: 400 })
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "يجب أن يكون الملف صورة" }, { status: 400 })
    }

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "حجم الملف كبير جدًا (الحد الأقصى 5 ميجابايت)" }, { status: 400 })
    }

    // تحويل الملف إلى Base64
    const buffer = await file.arrayBuffer()
    const base64Data = Buffer.from(buffer).toString("base64")

    // تخزين الصورة في قاعدة البيانات
    const image = await storeImage({
      filename: file.name,
      contentType: file.type,
      data: base64Data,
      uploadedBy: session.user.id,
    })

    return NextResponse.json({
      id: image.id,
      url: `/api/images/${image.id}`,
      filename: image.filename,
      contentType: image.contentType,
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تحميل الصورة" }, { status: 500 })
  }
}
