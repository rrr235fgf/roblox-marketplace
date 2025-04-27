import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createPrizeAccount, getAllPrizeAccounts } from "@/lib/db"

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
  const adminIds = ["admin1", "admin2"] // قم بتغيير هذه المعرفات حسب احتياجاتك

  if (!adminIds.includes(userId)) {
    return { isAdmin: false, error: "ليس لديك صلاحيات كافية", status: 403 }
  }

  return { isAdmin: true, userId }
}

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await checkAdminPermissions(request)

    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const accounts = await getAllPrizeAccounts()

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error("Error getting prize accounts:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب حسابات الجوائز" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdminPermissions(request)

    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const data = await request.json()
    const { type, username, password, details } = data

    // التحقق من صحة البيانات
    if (!type || !username || !password) {
      return NextResponse.json({ error: "البيانات غير كاملة" }, { status: 400 })
    }

    // التحقق من نوع الحساب
    if (!["bloxfruit", "medium", "premium"].includes(type)) {
      return NextResponse.json({ error: "نوع الحساب غير صالح" }, { status: 400 })
    }

    // إنشاء حساب جديد
    const account = await createPrizeAccount({
      id: "", // سيتم إنشاؤه تلقائياً في الدالة
      type: type as "bloxfruit" | "medium" | "premium",
      username,
      password,
      details: details || undefined,
    })

    return NextResponse.json({ success: true, account })
  } catch (error) {
    console.error("Error creating prize account:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء حساب الجائزة" }, { status: 500 })
  }
}
