"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Navbar } from "@/components/navbar"
import { TermsDialog } from "@/components/terms-dialog"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from "lucide-react"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const error = searchParams.get("error")

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push("/dashboard")
      }
    }
    checkSession()
  }, [router])

  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: getErrorMessage(error),
        variant: "destructive",
      })
    }
  }, [error, toast])

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "CredentialsSignin":
        return "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      default:
        return "حدث خطأ أثناء تسجيل الدخول"
    }
  }

  const validateForm = (isSignUp: boolean) => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح"
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة"
    } else if (isSignUp && formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
    }

    if (isSignUp) {
      if (!formData.name) {
        newErrors.name = "الاسم مطلوب"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "كلمات المرور غير متطابقة"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCredentialsAuth = async (isSignUp: boolean) => {
    if (!validateForm(isSignUp)) return

    if (isSignUp) {
      const hasAcceptedTerms = localStorage.getItem("termsAccepted")
      if (!hasAcceptedTerms) {
        setShowTerms(true)
        return
      }
    }

    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        isSignUp: isSignUp.toString(),
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "خطأ",
          description: result.error,
          variant: "destructive",
        })
      } else if (result?.ok) {
        if (isSignUp) {
          // إرسال رسالة التحقق
          await sendVerificationEmail(formData.email)
          setVerificationEmail(formData.email)
          setShowVerificationMessage(true)
        } else {
          toast({
            title: "نجح!",
            description: "تم تسجيل الدخول بنجاح",
          })
          router.push("/dashboard")
        }
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("فشل في إرسال رسالة التحقق")
      }
    } catch (error) {
      console.error("Error sending verification email:", error)
      toast({
        title: "تحذير",
        description: "تم إنشاء الحساب ولكن فشل في إرسال رسالة التحقق",
        variant: "destructive",
      })
    }
  }

  const resendVerificationEmail = async () => {
    setIsLoading(true)
    try {
      await sendVerificationEmail(verificationEmail)
      toast({
        title: "تم الإرسال",
        description: "تم إعادة إرسال رسالة التحقق",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إعادة إرسال رسالة التحقق",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptTerms = () => {
    localStorage.setItem("termsAccepted", "true")
    setShowTerms(false)
    handleCredentialsAuth(true)
  }

  if (showVerificationMessage) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">تحقق من بريدك الإلكتروني</CardTitle>
              <CardDescription>
                تم إرسال رسالة تحقق إلى <strong>{verificationEmail}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-sm text-blue-800">
                  يرجى فتح بريدك الإلكتروني والنقر على رابط التحقق لإكمال عملية التسجيل.
                </p>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={resendVerificationEmail}
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner className="mr-2" /> : null}
                  إعادة إرسال رسالة التحقق
                </Button>
                <Button onClick={() => setShowVerificationMessage(false)} variant="ghost" className="w-full">
                  العودة لتسجيل الدخول
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">مرحباً بك</CardTitle>
            <CardDescription>قم بتسجيل الدخول أو إنشاء حساب جديد للوصول إلى سوق المنتجات</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="example@email.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <Button onClick={() => handleCredentialsAuth(false)} className="w-full" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner className="mr-2" /> : null}
                    تسجيل الدخول
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="اسمك الكامل"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="example@email.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>

                  <Button onClick={() => handleCredentialsAuth(true)} className="w-full" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner className="mr-2" /> : null}
                    إنشاء حساب
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            بالتسجيل، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا
          </CardFooter>
        </Card>
      </main>

      <TermsDialog open={showTerms} onOpenChange={setShowTerms} onAccept={handleAcceptTerms} />
    </div>
  )
}
