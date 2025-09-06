import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, createEmailVerificationToken } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 })
    }

    // التحقق من وجود المستخدم
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "البريد الإلكتروني محقق بالفعل" }, { status: 400 })
    }

    // إنشاء رمز التحقق
    const token = await createEmailVerificationToken(user.id, email)

    // إرسال البريد الإلكتروني
    await sendVerificationEmail(email, user.username, token)

    return NextResponse.json({ message: "تم إرسال رسالة التحقق بنجاح" })
  } catch (error) {
    console.error("Error sending verification email:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء إرسال رسالة التحقق" }, { status: 500 })
  }
}
