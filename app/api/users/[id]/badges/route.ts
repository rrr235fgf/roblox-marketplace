import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { getUserById, updateUser } from "@/lib/db"

// تحديث شارات المستخدم
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لتعديل الشارات" }, { status: 401 })
    }

    // التحقق من صلاحيات المستخدم (يجب أن يكون لديه شارة "ادارة")
    const currentUser = await getUserById(session.user.id)
    if (!currentUser || !currentUser.badges.includes("ادارة")) {
      return NextResponse.json({ error: "ليس لديك صلاحية لتعديل شارات المستخدمين" }, { status: 403 })
    }

    const targetUser = await getUserById(params.id)
    if (!targetUser) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    const data = await request.json()
    const { badges } = data

    if (!Array.isArray(badges)) {
      return NextResponse.json({ error: "تنسيق الشارات غير صالح" }, { status: 400 })
    }

    // الشارات المسموح بها للتعيين اليدوي
    const allowedBadges = ["مميز", "مشهور", "ادارة", "موثوق"]

    // الشارات التلقائية التي لا يجب تغييرها
    const automaticBadges = ["عضو جديد", "عضو نشط", "عضو متميز", "عضو محترف"]

    // الحصول على الشارات التلقائية الحالية
    const currentAutomaticBadges = targetUser.badges.filter((badge) => automaticBadges.includes(badge))

    // الشارات اليدوية الجديدة (فقط من القائمة المسموح بها)
    const newManualBadges = badges.filter((badge) => allowedBadges.includes(badge))

    // دمج الشارات التلقائية والشارات اليدوية
    const updatedBadges = [...currentAutomaticBadges, ...newManualBadges]

    // تحديث المستخدم
    const updated = await updateUser(params.id, { badges: updatedBadges })

    if (!updated) {
      return NextResponse.json({ error: "فشل تحديث الشارات" }, { status: 500 })
    }

    return NextResponse.json({ success: true, badges: updatedBadges })
  } catch (error) {
    console.error("Error updating user badges:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث الشارات" }, { status: 500 })
  }
}
