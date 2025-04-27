import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { canUserSpin, recordLuckyWheelSpin, getUnclaimedPrizeAccountByType, claimPrizeAccount } from "@/lib/db"
import crypto from "crypto"

// تحويل نوع الجائزة من الواجهة إلى قاعدة البيانات
const mapPrizeType = (uiType: number): "empty" | "bloxfruit" | "medium" | "premium" => {
  switch (uiType) {
    case 1:
      return "empty"
    case 2:
      return "bloxfruit"
    case 3:
      return "medium"
    case 4:
      return "premium"
    default:
      return "empty"
  }
}

export async function POST(request: NextRequest) {
  try {
    // التحقق من المستخدم
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const userId = session.user.id as string

    // التحقق مما إذا كان المستخدم يمكنه الدوران
    const canSpin = await canUserSpin(userId)
    if (!canSpin) {
      return NextResponse.json({ error: "لا يمكنك الدوران الآن، يرجى الانتظار حتى انتهاء المدة" }, { status: 403 })
    }

    // الحصول على بيانات الدوران
    const data = await request.json()
    const { prizeId } = data

    // تحويل نوع الجائزة
    const prizeType = mapPrizeType(prizeId)

    // إنشاء معرف فريد للدوران
    const spinId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)

    // حساب وقت الدوران التالي (بعد 24 ساعة)
    const now = new Date()
    const nextSpinTime = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    let prizeAccountId = undefined
    let prizeAccount = null

    // إذا كانت الجائزة ليست حساب فاضي، نحصل على حساب غير مطالب به
    if (prizeType !== "empty") {
      prizeAccount = await getUnclaimedPrizeAccountByType(prizeType)

      if (prizeAccount) {
        // المطالبة بالحساب
        await claimPrizeAccount(prizeAccount.id, userId)
        prizeAccountId = prizeAccount.id
      }
    }

    // تسجيل الدوران
    await recordLuckyWheelSpin({
      id: spinId,
      userId,
      prizeType,
      prizeAccountId,
      spinTime: now,
      nextSpinTime,
    })

    // إرجاع النتيجة
    return NextResponse.json({
      success: true,
      prize: {
        id: prizeId,
        type: prizeType,
        account: prizeAccount
          ? {
              username: prizeAccount.username,
              password: prizeAccount.password,
              details: prizeAccount.details,
            }
          : null,
      },
      nextSpinTime,
    })
  } catch (error) {
    console.error("Error processing lucky wheel spin:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة الدوران" }, { status: 500 })
  }
}
