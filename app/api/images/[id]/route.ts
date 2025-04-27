import { type NextRequest, NextResponse } from "next/server"
import { getImageById, deleteImage } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

// الحصول على صورة بواسطة المعرف
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const image = await getImageById(params.id)

    if (!image) {
      return NextResponse.json({ error: "الصورة غير موجودة" }, { status: 404 })
    }

    // إعادة الصورة كـ Base64
    const buffer = Buffer.from(image.data, "base64")

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": image.contentType,
        "Content-Disposition": `inline; filename="${image.filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error fetching image:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الصورة" }, { status: 500 })
  }
}

// حذف صورة
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لحذف الصورة" }, { status: 401 })
    }

    const image = await getImageById(params.id)

    if (!image) {
      return NextResponse.json({ error: "الصورة غير موجودة" }, { status: 404 })
    }

    // التحقق من أن المستخدم هو من قام بتحميل الصورة
    if (image.uploadedBy !== session.user.id) {
      return NextResponse.json({ error: "غير مصرح لك بحذف هذه الصورة" }, { status: 403 })
    }

    const deleted = await deleteImage(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "فشل حذف الصورة" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء حذف الصورة" }, { status: 500 })
  }
}
