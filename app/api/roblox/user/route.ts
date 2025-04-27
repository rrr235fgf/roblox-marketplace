import { type NextRequest, NextResponse } from "next/server"
import { searchUserByName, generateUserFromName } from "@/lib/roblox-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "اسم المستخدم مطلوب" }, { status: 400 })
    }

    // البحث عن المستخدم في البيانات المحلية
    let user = searchUserByName(username)

    // إذا لم يتم العثور على المستخدم، قم بإنشاء مستخدم جديد
    if (!user) {
      user = generateUserFromName(username)
    }

    // إضافة تأخير اصطناعي لمحاكاة طلب API حقيقي (500-1500 مللي ثانية)
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب بيانات المستخدم" }, { status: 500 })
  }
}
