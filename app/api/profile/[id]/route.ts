import { type NextRequest, NextResponse } from "next/server"
import { getUserById } from "@/lib/db"

// الحصول على ملف شخصي لمستخدم محدد
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserById(params.id)

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    // إزالة المعلومات الحساسة
    const { _id, email, ...userProfile } = user

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الملف الشخصي" }, { status: 500 })
  }
}
