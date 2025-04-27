import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getDb } from "@/lib/db/db"

// التحقق من صلاحيات المسؤول
async function checkAdminPermissions(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return { isAdmin: false, error: "غير مصرح", status: 401 }
  }

  const userId = session.user.id as string

  // هنا يمكنك إضافة المزيد من التحققات للتأكد من أن المستخدم مسؤول
  // على سبيل المثال، التحقق من وجود شارة "ادارة" أو دور خاص

  // للتبسيط، سنفترض أن المستخدمين الذين لديهم معرفات محددة هم مسؤولون
  const adminIds = ["1258005624042684497", "1014660591366971483"] // قم بتغيير هذه المعرفات حسب احتياجاتك

  if (!adminIds.includes(userId)) {
    return { isAdmin: false, error: "ليس لديك صلاحيات كافية", status: 403 }
  }

  return { isAdmin: true, userId }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminCheck = await checkAdminPermissions(request)

    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "معرف الحساب مطلوب" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("prizeAccounts").deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "لم يتم العثور على الحساب" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting prize account:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء حذف حساب الجائزة" }, { status: 500 })
  }
}
