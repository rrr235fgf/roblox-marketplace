import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { getDb } from "@/lib/db/db"

// رابط ويبهوك Discord - سيتم استبداله بالرابط الفعلي
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1342878895770439814/oEGzuc9SrkXmr6xipfMJxtzLIj-kpkpObVG8P1qtdP9LCXs7au2hSuoCjdH9xmGZ-g7S"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email } = data

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 })
    }

    // التحقق مما إذا كان البريد الإلكتروني مسجل بالفعل
    const db = await getDb()
    const existingSubscription = await db.collection("newsletter_subscriptions").findOne({ email })

    if (existingSubscription) {
      return NextResponse.json({ message: "أنت مشترك بالفعل في النشرة الإخبارية" })
    }

    // إضافة الاشتراك الجديد
    const now = new Date()
    const subscriptionId = uuidv4()

    await db.collection("newsletter_subscriptions").insertOne({
      id: subscriptionId,
      email,
      createdAt: now,
    })

    // إرسال إشعار إلى Discord
    if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL !== "https://discord.com/api/webhooks/1342878895770439814/oEGzuc9SrkXmr6xipfMJxtzLIj-kpkpObVG8P1qtdP9LCXs7au2hSuoCjdH9xmGZ-g7S") {
      try {
        await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: `🔔 اشتراك جديد في النشرة الإخبارية!`,
            embeds: [
              {
                title: "اشتراك جديد",
                description: `البريد الإلكتروني: ${email}`,
                color: 0x954ce9, // لون أرجواني
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        })
      } catch (webhookError) {
        console.error("Error sending Discord webhook:", webhookError)
        // نستمر حتى لو فشل إرسال الويبهوك
      }
    }

    return NextResponse.json({ success: true, message: "تم الاشتراك بنجاح" })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء الاشتراك في النشرة الإخبارية" }, { status: 500 })
  }
}
