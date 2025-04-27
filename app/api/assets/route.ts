import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { createAsset, getAssets, getUserById, updateUser } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { containsInappropriateContent, sanitizeText } from "@/lib/utils"

// الحصول على جميع الأصول
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category") || undefined
    const sellerId = searchParams.get("sellerId") || undefined
    const searchQuery = searchParams.get("search") || undefined
    const featured = searchParams.get("featured") === "true" ? true : undefined
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = Number.parseInt(searchParams.get("skip") || "0")

    const assets = await getAssets({
      category,
      sellerId,
      searchQuery,
      featured,
      limit,
      skip,
    })

    return NextResponse.json(assets)
  } catch (error) {
    console.error("Error fetching assets:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الأصول" }, { status: 500 })
  }
}

// إنشاء أصل جديد
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لإنشاء أصل جديد" }, { status: 401 })
    }

    const data = await request.json()

    // التحقق من البيانات المطلوبة
    if (!data.title || !data.description || !data.price || !data.category || !data.images || data.images.length === 0) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })
    }

    // التحقق من وجود محتوى غير لائق
    if (containsInappropriateContent(data.title) || containsInappropriateContent(data.description)) {
      return NextResponse.json({ error: "المحتوى يحتوي على كلمات غير لائقة" }, { status: 400 })
    }

    // الحصول على معلومات المستخدم
    const user = await getUserById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    const now = new Date()

    // تم إزالة التحقق من وقت الانتظار للمستخدمين الجدد (10 دقائق)

    // التحقق من وقت آخر منتج تم إضافته
    if (user.lastAssetCreatedAt) {
      const lastAssetTime = new Date(user.lastAssetCreatedAt)
      const timeSinceLastAsset = now.getTime() - lastAssetTime.getTime()
      const oneHourInMs = 60 * 60 * 1000

      if (timeSinceLastAsset < oneHourInMs) {
        const remainingMinutes = Math.floor((oneHourInMs - timeSinceLastAsset) / 60000)
        const remainingSeconds = Math.floor(((oneHourInMs - timeSinceLastAsset) % 60000) / 1000)

        let timeMessage = `${remainingMinutes} دقيقة`
        if (remainingSeconds > 0) {
          timeMessage += ` و ${remainingSeconds} ثانية`
        }

        return NextResponse.json(
          {
            error: `لا يمكنك نشر منتج جديد الآن. السبب: يجب الانتظار ساعة كاملة بين كل منتج وآخر.\nالوقت المتبقي: ${timeMessage}`,
            remainingTime: {
              minutes: remainingMinutes,
              seconds: remainingSeconds,
              total: oneHourInMs - timeSinceLastAsset,
            },
            reason: "post_cooldown",
          },
          { status: 429 },
        )
      }
    }

    // تنقية النصوص
    const sanitizedTitle = sanitizeText(data.title)
    const sanitizedDescription = sanitizeText(data.description)

    // إنشاء معرف فريد للأصل
    const assetId = uuidv4()

    // إنشاء الأصل
    const newAsset = await createAsset({
      id: assetId,
      title: sanitizedTitle,
      description: sanitizedDescription,
      price: Number.parseFloat(data.price),
      category: data.category,
      paymentMethod: data.paymentMethod,
      images: data.images,
      rating: 0,
      ratingCount: 0,
      sellerId: session.user.id,
      featured: false,
    })

    // تحديث وقت آخر منتج تم إضافته
    await updateUser(session.user.id, { lastAssetCreatedAt: now })

    return NextResponse.json(newAsset)
  } catch (error) {
    console.error("Error creating asset:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء الأصل" }, { status: 500 })
  }
}
