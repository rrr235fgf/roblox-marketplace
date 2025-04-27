import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { getAssetById, updateAsset, deleteAsset } from "@/lib/db"

// الحصول على أصل بواسطة المعرف
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const asset = await getAssetById(params.id)

    if (!asset) {
      return NextResponse.json({ error: "الأصل غير موجود" }, { status: 404 })
    }

    return NextResponse.json(asset)
  } catch (error) {
    console.error("Error fetching asset:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الأصل" }, { status: 500 })
  }
}

// تحديث أصل
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لتحديث الأصل" }, { status: 401 })
    }

    const asset = await getAssetById(params.id)

    if (!asset) {
      return NextResponse.json({ error: "الأصل غير موجود" }, { status: 404 })
    }

    // التحقق من أن المستخدم هو مالك الأصل
    if (asset.sellerId !== session.user.id) {
      return NextResponse.json({ error: "غير مصرح لك بتحديث هذا الأصل" }, { status: 403 })
    }

    const data = await request.json()

    // تحديث الأصل
    const updated = await updateAsset(params.id, {
      title: data.title,
      description: data.description,
      price: Number.parseFloat(data.price),
      category: data.category,
      images: data.images,
    })

    if (!updated) {
      return NextResponse.json({ error: "فشل تحديث الأصل" }, { status: 500 })
    }

    // الحصول على الأصل المحدث
    const updatedAsset = await getAssetById(params.id)

    return NextResponse.json(updatedAsset)
  } catch (error) {
    console.error("Error updating asset:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث الأصل" }, { status: 500 })
  }
}

// حذف أصل
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لحذف الأصل" }, { status: 401 })
    }

    const asset = await getAssetById(params.id)

    if (!asset) {
      return NextResponse.json({ error: "الأصل غير موجود" }, { status: 404 })
    }

    // التحقق من أن المستخدم هو مالك الأصل
    if (asset.sellerId !== session.user.id) {
      return NextResponse.json({ error: "غير مصرح لك بحذف هذا الأصل" }, { status: 403 })
    }

    // حذف الأصل
    const deleted = await deleteAsset(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "فشل حذف الأصل" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting asset:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء حذف الأصل" }, { status: 500 })
  }
}
