import nodemailer from "nodemailer"

// إعداد النقل للبريد الإلكتروني
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// إرسال رسالة التحقق
export async function sendVerificationEmail(email: string, username: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "تحقق من بريدك الإلكتروني - سوق المنتجات",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">سوق المنتجات</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin-top: 0;">مرحباً ${username}!</h2>
          <p style="color: #475569; line-height: 1.6; margin-bottom: 25px;">
            شكراً لك على التسجيل في سوق المنتجات. لإكمال عملية التسجيل، يرجى النقر على الزر أدناه للتحقق من بريدك الإلكتروني.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              تحقق من البريد الإلكتروني
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
            إذا لم تتمكن من النقر على الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:
          </p>
          <p style="color: #2563eb; font-size: 14px; word-break: break-all;">
            ${verificationUrl}
          </p>
        </div>
        
        <div style="text-align: center; color: #64748b; font-size: 12px;">
          <p>هذا الرابط صالح لمدة 24 ساعة فقط.</p>
          <p>إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.</p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

// إرسال رسالة إعادة تعيين كلمة المرور
export async function sendPasswordResetEmail(email: string, username: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "إعادة تعيين كلمة المرور - سوق المنتجات",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">سوق المنتجات</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin-top: 0;">مرحباً ${username}!</h2>
          <p style="color: #475569; line-height: 1.6; margin-bottom: 25px;">
            تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. إذا كنت قد طلبت ذلك، يرجى النقر على الزر أدناه.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              إعادة تعيين كلمة المرور
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
            إذا لم تتمكن من النقر على الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:
          </p>
          <p style="color: #dc2626; font-size: 14px; word-break: break-all;">
            ${resetUrl}
          </p>
        </div>
        
        <div style="text-align: center; color: #64748b; font-size: 12px;">
          <p>هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
          <p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.</p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
