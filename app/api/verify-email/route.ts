import { type NextRequest, NextResponse } from "next/server"
import { verifyEmailToken, updateUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "رمز التحقق مطلوب" }, { status: 400 })
    }

    // التحقق من الرمز
    const verification = await verifyEmailToken(token)
    if (!verification) {
      return NextResponse.json({ error: "رمز التحقق غير صحيح أو منتهي الصلاحية" }, { status: 400 })
    }

    // تحديث حالة التحقق للمستخدم
    await updateUser(verification.userId, { emailVerified: true })

    return NextResponse.json({ message: "تم التحقق من البريد الإلكتروني بنجاح" })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء التحقق من البريد الإلكتروني" }, { status: 500 })
  }
}
