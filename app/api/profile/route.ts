import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { getUserById, updateUser } from "@/lib/db"

// الحصول على الملف الشخصي للمستخدم الحالي
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول للوصول إلى الملف الشخصي" }, { status: 401 })
    }

    const user = await getUserById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    // إزالة المعلومات الحساسة
    const { _id, ...userProfile } = user

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الملف الشخصي" }, { status: 500 })
  }
}

// تحديث الملف الشخصي للمستخدم الحالي
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لتحديث الملف الشخصي" }, { status: 401 })
    }

    const data = await request.json()

    // تحديث المستخدم
    const updated = await updateUser(session.user.id, {
      username: data.username,
      // يمكن إضافة المزيد من الحقول القابلة للتحديث هنا
    })

    if (!updated) {
      return NextResponse.json({ error: "فشل تحديث الملف الشخصي" }, { status: 500 })
    }

    // الحصول على المستخدم المحدث
    const updatedUser = await getUserById(session.user.id)

    // إزالة المعلومات الحساسة
    const { _id, ...userProfile } = updatedUser

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث الملف الشخصي" }, { status: 500 })
  }
}
