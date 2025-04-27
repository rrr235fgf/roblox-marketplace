import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { getAssetById, updateAsset, getUserById } from "@/lib/db"

// تعيين منتج كمميز أو إلغاء تمييزه
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لتعديل المنتجات" }, { status: 401 })
    }

    // التحقق من صلاحيات المستخدم (يجب أن يكون لديه شارة "ادارة")
    const user = await getUserById(session.user.id)
    if (!user || !user.badges.includes("ادارة")) {
      return NextResponse.json({ error: "ليس لديك صلاحية لتعديل حالة التمييز للمنتجات" }, { status: 403 })
    }

    const asset = await getAssetById(params.id)
    if (!asset) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 })
    }

    // تبديل حالة التمييز
    const featured = !asset.featured

    // تحديث المنتج
    const updated = await updateAsset(params.id, { featured })

    if (!updated) {
      return NextResponse.json({ error: "فشل تحديث حالة التمييز" }, { status: 500 })
    }

    return NextResponse.json({ success: true, featured })
  } catch (error) {
    console.error("Error toggling feature status:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث حالة التمييز" }, { status: 500 })
  }
}
