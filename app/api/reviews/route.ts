import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { createReview, getAssetReviews } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// الحصول على تقييمات أصل
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get("assetId")

    if (!assetId) {
      return NextResponse.json({ error: "معرف الأصل مطلوب" }, { status: 400 })
    }

    const reviews = await getAssetReviews(assetId)

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب التقييمات" }, { status: 500 })
  }
}

// إضافة تقييم جديد
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لإضافة تقييم" }, { status: 401 })
    }

    const data = await request.json()

    // التحقق من البيانات المطلوبة
    if (!data.assetId || !data.rating || !data.comment) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })
    }

    // إنشاء معرف فريد للتقييم
    const reviewId = uuidv4()

    // إنشاء التقييم
    const newReview = await createReview({
      id: reviewId,
      assetId: data.assetId,
      userId: session.user.id,
      rating: Number.parseFloat(data.rating),
      comment: data.comment,
    })

    return NextResponse.json(newReview)
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء التقييم" }, { status: 500 })
  }
}
