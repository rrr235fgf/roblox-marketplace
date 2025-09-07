import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { toggleProfileLike } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    if (session.user.id === params.id) {
      return NextResponse.json({ error: "لا يمكنك الإعجاب بملفك الشخصي" }, { status: 400 })
    }

    const result = await toggleProfileLike(params.id, session.user.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
