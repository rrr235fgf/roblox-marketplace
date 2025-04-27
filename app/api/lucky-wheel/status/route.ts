import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getLastUserLuckyWheelSpin } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // التحقق من المستخدم
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const userId = session.user.id as string

    // الحصول على آخر دوران للمستخدم
    const lastSpin = await getLastUserLuckyWheelSpin(userId)

    if (!lastSpin) {
      return NextResponse.json({
        canSpin: true,
        nextSpinTime: null,
      })
    }

    const now = new Date()
    const nextSpinTime = new Date(lastSpin.nextSpinTime)
    const canSpin = now >= nextSpinTime

    return NextResponse.json({
      canSpin,
      nextSpinTime: canSpin ? null : nextSpinTime,
      lastSpin: {
        prizeType: lastSpin.prizeType,
        spinTime: lastSpin.spinTime,
      },
    })
  } catch (error) {
    console.error("Error getting lucky wheel status:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء الحصول على حالة عجلة الحظ" }, { status: 500 })
  }
}
