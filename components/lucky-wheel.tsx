"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Clock, Trophy, AlertTriangle, Sparkles, Lock } from "lucide-react"
import confetti from "canvas-confetti"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// تعريف الجوائز ونسبها
const prizes = [
  { id: 1, name: "حساب فاضي", probability: 50, color: "#FF5252", icon: AlertTriangle },
  { id: 2, name: "حساب بلوكس فروت", probability: 25, color: "#4CAF50", icon: Gift },
  { id: 3, name: "حساب متوسط", probability: 15, color: "#2196F3", icon: Gift },
  { id: 4, name: "حساب مشحون", probability: 10, color: "#FFC107", icon: Trophy },
]

// حساب الزوايا لكل جائزة
const calculateSegments = () => {
  const segments = []
  let startAngle = 0

  prizes.forEach((prize) => {
    const angle = (prize.probability / 100) * 360
    segments.push({
      ...prize,
      startAngle,
      endAngle: startAngle + angle,
      midAngle: startAngle + angle / 2,
    })
    startAngle += angle
  })

  return segments
}

interface LuckyWheelProps {
  userId: string
}

export function LuckyWheel({ userId }: LuckyWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [nextSpinTime, setNextSpinTime] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAccountDialog, setShowAccountDialog] = useState(false)
  const [accountDetails, setAccountDetails] = useState<any>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const segments = calculateSegments()

  // تحقق من حالة عجلة الحظ عند تحميل المكون
  useEffect(() => {
    const checkWheelStatus = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/lucky-wheel/status")

        if (!response.ok) {
          throw new Error("فشل في الحصول على حالة عجلة الحظ")
        }

        const data = await response.json()

        if (!data.canSpin && data.nextSpinTime) {
          setNextSpinTime(new Date(data.nextSpinTime).getTime())
          const now = Date.now()
          setTimeLeft(Math.ceil((new Date(data.nextSpinTime).getTime() - now) / 1000))
        }
      } catch (error) {
        console.error("Error checking wheel status:", error)
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء التحقق من حالة عجلة الحظ",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkWheelStatus()
  }, [userId, toast])

  // تحديث العد التنازلي
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          setNextSpinTime(null)
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // تنسيق الوقت المتبقي
  const formatTimeLeft = () => {
    if (timeLeft === null) return ""

    const hours = Math.floor(timeLeft / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const seconds = timeLeft % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // دالة لإطلاق الألعاب النارية عند الفوز
  const triggerWinAnimation = (prize: any) => {
    if (prize.id !== 1) {
      // ليس حساب فاضي
      const canvas = document.createElement("canvas")
      canvas.style.position = "fixed"
      canvas.style.inset = "0"
      canvas.style.width = "100vw"
      canvas.style.height = "100vh"
      canvas.style.zIndex = "999"
      canvas.style.pointerEvents = "none"
      document.body.appendChild(canvas)

      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true,
      })

      myConfetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.6 },
        colors: [prize.color, "#ffffff", "#9c27b0"],
      })

      setTimeout(() => {
        document.body.removeChild(canvas)
      }, 3000)
    }
  }

  // دالة لتدوير العجلة
  const spinWheel = async () => {
    if (isSpinning || timeLeft !== null || isLoading) return

    try {
      setIsSpinning(true)
      setWinner(null)

      // اختيار الفائز بناءً على الاحتمالات
      const random = Math.random() * 100
      let cumulativeProbability = 0
      let selectedPrize = prizes[0]

      for (const prize of prizes) {
        cumulativeProbability += prize.probability
        if (random <= cumulativeProbability) {
          selectedPrize = prize
          break
        }
      }

      // حساب زاوية الدوران
      const selectedSegment = segments.find((segment) => segment.id === selectedPrize.id)
      const targetAngle = 360 - selectedSegment!.midAngle
      const spins = 5 // عدد الدورات الكاملة
      const spinAngle = 360 * spins + targetAngle + Math.random() * 30 - 15 // إضافة عشوائية صغيرة

      // تعيين الدوران
      setRotation(spinAngle)

      // إرسال طلب إلى الخادم
      const response = await fetch("/api/lucky-wheel/spin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prizeId: selectedPrize.id,
        }),
      })

      if (!response.ok) {
        throw new Error("فشل في معالجة الدوران")
      }

      const data = await response.json()

      // بعد انتهاء الدوران
      setTimeout(() => {
        setIsSpinning(false)
        setWinner(selectedPrize)
        triggerWinAnimation(selectedPrize)

        // حفظ وقت الدوران التالي
        if (data.nextSpinTime) {
          const nextTime = new Date(data.nextSpinTime).getTime()
          setNextSpinTime(nextTime)
          setTimeLeft(Math.ceil((nextTime - Date.now()) / 1000))
        }

        // حفظ تفاصيل الحساب إذا كان هناك
        if (data.prize && data.prize.account) {
          setAccountDetails(data.prize.account)
        }

        // إظهار رسالة النتيجة
        toast({
          title: selectedPrize.id === 1 ? "للأسف لم تربح هذه المرة" : "مبروك! لقد ربحت",
          description: `النتيجة: ${selectedPrize.name}`,
          variant: selectedPrize.id === 1 ? "destructive" : "default",
        })
      }, 5000) // وقت الدوران
    } catch (error) {
      console.error("Error spinning wheel:", error)
      setIsSpinning(false)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تدوير العجلة",
        variant: "destructive",
      })
    }
  }

  // دالة لعرض تفاصيل الحساب
  const showAccountDetails = () => {
    if (accountDetails) {
      setShowAccountDialog(true)
    }
  }

  return (
    <>
      <Card className="overflow-hidden shadow-lg border-primary/20">
        <CardContent className="p-6">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 mb-6">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">عجلة الحظ</h2>
                <p className="text-sm text-muted-foreground">
                  جرب حظك واربح حسابات روبلوكس مجانية! يمكنك لف العجلة مرة واحدة كل 24 ساعة
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* مؤشر العجلة */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-primary z-20" />

                {/* العجلة */}
                <motion.div
                  ref={wheelRef}
                  className="w-full h-full rounded-full overflow-hidden border-8 border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] relative"
                  style={{
                    transformOrigin: "center",
                    backgroundImage: `conic-gradient(${segments
                      .map((segment) => `${segment.color} 0deg ${segment.endAngle}deg`)
                      .join(", ")})`,
                  }}
                  animate={{ rotate: rotation }}
                  transition={{ duration: 5, ease: "easeOut" }}
                >
                  {/* أسماء الجوائز */}
                  {segments.map((segment) => (
                    <div
                      key={segment.id}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-center w-full h-full flex items-center justify-center"
                      style={{
                        transform: `rotate(${segment.midAngle}deg) translateY(-35%)`,
                        transformOrigin: "center",
                        textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                      }}
                    >
                      <div className="flex flex-col items-center rotate-180">
                        <segment.icon className="h-6 w-6 mb-1" />
                        <span className="text-xs md:text-sm">{segment.name}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <Button
                onClick={spinWheel}
                disabled={isSpinning || timeLeft !== null || isLoading}
                className="mt-8 px-8 py-2 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-primary/20 hover:scale-105"
              >
                {isLoading
                  ? "جاري التحميل..."
                  : isSpinning
                    ? "جاري الدوران..."
                    : timeLeft !== null
                      ? "انتظر للدوران التالي"
                      : "لف العجلة"}
              </Button>

              {timeLeft !== null && (
                <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>الدوران التالي بعد: {formatTimeLeft()}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="rounded-lg bg-muted p-4 mb-4">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  الجوائز المتاحة
                </h3>
                <ul className="space-y-3">
                  {prizes.map((prize) => (
                    <li key={prize.id} className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: prize.color }}
                      >
                        <prize.icon className="h-3 w-3" />
                      </div>
                      <span className="font-medium">{prize.name}</span>
                      <span className="text-sm text-muted-foreground ml-auto">{prize.probability}%</span>
                    </li>
                  ))}
                </ul>
              </div>

              <AnimatePresence>
                {winner && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`rounded-lg p-6 text-center ${winner.id === 1 ? "bg-red-500/10" : "bg-gradient-to-r from-primary/20 to-purple-500/20"}`}
                  >
                    <h3 className="text-xl font-bold mb-2">
                      {winner.id === 1 ? "للأسف لم تربح هذه المرة" : "مبروك! لقد ربحت"}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: winner.color }}
                      >
                        <winner.icon className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-medium">{winner.name}</span>
                    </div>

                    {winner.id !== 1 && accountDetails && (
                      <div className="flex justify-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                            rotate: [-1, 1, -1, 1, 0],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        >
                          <Button onClick={showAccountDetails} className="bg-gradient-to-r from-primary to-purple-600">
                            <Sparkles className="mr-2 h-4 w-4" />
                            عرض تفاصيل الحساب
                          </Button>
                        </motion.div>
                      </div>
                    )}

                    {winner.id !== 1 && !accountDetails && (
                      <div className="mt-2 p-3 bg-yellow-500/20 rounded-lg">
                        <p className="text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span>للأسف لا توجد حسابات متاحة من هذا النوع حالياً، يرجى التواصل مع الإدارة</span>
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="rounded-lg bg-muted p-4 mt-auto">
                <p className="text-sm">
                  <span className="font-medium">ملاحظة:</span> يمكنك لف العجلة مرة واحدة كل 24 ساعة. استمتع بفرصتك للفوز
                  بحسابات روبلوكس مجانية!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* مربع حوار تفاصيل الحساب */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل الحساب</DialogTitle>
            <DialogDescription>هذه هي تفاصيل حساب روبلوكس الخاص بك. يرجى حفظها في مكان آمن.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="username"
                  value={accountDetails?.username || ""}
                  readOnly
                  className="flex-1 text-left"
                  dir="ltr"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(accountDetails?.username || "")
                    toast({
                      title: "تم النسخ",
                      description: "تم نسخ اسم المستخدم إلى الحافظة",
                    })
                  }}
                >
                  نسخ
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="password"
                  value={accountDetails?.password || ""}
                  readOnly
                  className="flex-1 text-left"
                  dir="ltr"
                  type="password"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(accountDetails?.password || "")
                    toast({
                      title: "تم النسخ",
                      description: "تم نسخ كلمة المرور إلى الحافظة",
                    })
                  }}
                >
                  نسخ
                </Button>
              </div>
            </div>
            {accountDetails?.details && (
              <div className="space-y-2">
                <Label htmlFor="details">تفاصيل إضافية</Label>
                <div className="p-3 bg-muted rounded-md text-sm" dir="ltr">
                  {accountDetails.details}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
            <div className="flex items-center text-sm text-muted-foreground mb-3 sm:mb-0">
              <Lock className="h-3 w-3 mr-1" />
              <span>هذه المعلومات متاحة لك فقط</span>
            </div>
            <Button type="button" onClick={() => setShowAccountDialog(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
