import { type NextRequest, NextResponse } from "next/server"
import { verifyEmailToken, updateUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "رمز التحقق مطلوب" }, { status: 400 })
    }

    // التحقق من الرمز
    const verificationToken = await verifyEmailToken(token)
    if (!verificationToken) {
      return NextResponse.json({ error: "رمز التحقق غير صحيح أو منتهي الصلاحية" }, { status: 400 })
    }

    // تحديث حالة التحقق للمستخدم
    await updateUser(verificationToken.userId, { emailVerified: true })

    return NextResponse.json({ message: "تم التحقق من البريد الإلكتروني بنجاح" })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ error: "فشل في التحقق من البريد الإلكتروني" }, { status: 500 })
  }
}
