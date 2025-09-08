import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "لم يتم العثور على ملف" }, { status: 400 })
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "يجب أن يكون الملف صورة" }, { status: 400 })
    }

    // التحقق من حجم الملف (أقل من 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "حجم الملف كبير جداً (الحد الأقصى 10MB)" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // إنشاء مجلد uploads إذا لم يكن موجوداً
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // إنشاء اسم ملف فريد
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop() || "jpg"
    const fileName = `${timestamp}_${randomString}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // حفظ الملف
    await writeFile(filePath, buffer)

    // إرجاع رابط الصورة
    const imageUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: "تم رفع الصورة بنجاح",
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء رفع الصورة" }, { status: 500 })
  }
}
