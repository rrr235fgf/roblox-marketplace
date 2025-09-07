// مكتبة بريد إلكتروني بسيطة للتطوير
export async function sendVerificationEmail(email: string, token: string) {
  // في بيئة التطوير، نطبع الرابط في وحدة التحكم
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

  console.log(`
=== رسالة تحقق البريد الإلكتروني ===
إلى: ${email}
الموضوع: تحقق من بريدك الإلكتروني
الرابط: ${verificationUrl}
=====================================
  `)

  // في بيئة الإنتاج، يمكن استخدام خدمة بريد إلكتروني حقيقية
  return Promise.resolve(true)
}

export function createTransporter() {
  // وظيفة وهمية للتوافق
  return {
    sendMail: async (options: any) => {
      console.log("إرسال بريد إلكتروني:", options)
      return Promise.resolve({ messageId: "test-message-id" })
    },
  }
}
