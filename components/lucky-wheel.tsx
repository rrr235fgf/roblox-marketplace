"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import Confetti from "react-confetti"
import { Gift, Clock, Star, Trophy, Zap } from "lucide-react"

interface Prize {
  id: string
  name: string
  type: "empty" | "bloxfruit" | "medium" | "premium"
  probability: number
  color: string
  icon: React.ReactNode
}

const prizes: Prize[] = [
  {
    id: "1",
    name: "حظ أوفر المرة القادمة",
    type: "empty",
    probability: 70,
    color: "#6b7280",
    icon: <Clock className="w-6 h-6" />,
  },
  {
    id: "2",
    name: "حساب Blox Fruit",
    type: "bloxfruit",
    probability: 20,
    color: "#3b82f6",
    icon: <Gift className="w-6 h-6" />,
  },
  {
    id: "3",
    name: "حساب متوسط",
    type: "medium",
    probability: 8,
    color: "#f59e0b",
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: "4",
    name: "حساب مميز",
    type: "premium",
    probability: 2,
    color: "#ef4444",
    icon: <Trophy className="w-6 h-6" />,
  },
]

export function LuckyWheel() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [canSpin, setCanSpin] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [lastPrize, setLastPrize] = useState<Prize | null>(null)

  useEffect(() => {
    if (!user) return

    const checkSpinStatus = () => {
      const lastSpinTime = localStorage.getItem(`lastSpin_${user.id}`)
      if (lastSpinTime) {
        const timeDiff = Date.now() - Number.parseInt(lastSpinTime)
        const hoursLeft = 24 - Math.floor(timeDiff / (1000 * 60 * 60))

        if (hoursLeft > 0) {
          setCanSpin(false)
          setTimeLeft(hoursLeft)
        } else {
          setCanSpin(true)
          setTimeLeft(0)
        }
      }
    }

    checkSpinStatus()
    const interval = setInterval(checkSpinStatus, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [user])

  const selectPrize = (): Prize => {
    const random = Math.random() * 100
    let cumulative = 0

    for (const prize of prizes) {
      cumulative += prize.probability
      if (random <= cumulative) {
        return prize
      }
    }

    return prizes[0] // Fallback
  }

  const handleSpin = async () => {
    if (!user || !canSpin || isSpinning) return

    setIsSpinning(true)
    const selectedPrize = selectPrize()

    // Calculate rotation to land on selected prize
    const prizeIndex = prizes.findIndex((p) => p.id === selectedPrize.id)
    const sectionAngle = 360 / prizes.length
    const targetAngle = prizeIndex * sectionAngle + sectionAngle / 2
    const spins = 5 // Number of full rotations
    const finalRotation = rotation + spins * 360 + (360 - targetAngle)

    setRotation(finalRotation)

    // Store spin time
    localStorage.setItem(`lastSpin_${user.id}`, Date.now().toString())
    setCanSpin(false)
    setTimeLeft(24)

    setTimeout(() => {
      setIsSpinning(false)
      setLastPrize(selectedPrize)

      if (selectedPrize.type !== "empty") {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)

        toast({
          title: "🎉 مبروك!",
          description: `لقد ربحت: ${selectedPrize.name}`,
          duration: 5000,
        })
      } else {
        toast({
          title: "😔 للأسف",
          description: selectedPrize.name,
          variant: "destructive",
        })
      }
    }, 4000)
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            عجلة الحظ
          </CardTitle>
          <CardDescription>يجب تسجيل الدخول للعب</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">قم بتسجيل الدخول للحصول على فرصة للفوز بجوائز رائعة!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            عجلة الحظ
          </CardTitle>
          <CardDescription>
            {canSpin ? "اضغط على الزر لتدوير العجلة والفوز بجوائز رائعة!" : `يمكنك اللعب مرة أخرى بعد ${timeLeft} ساعة`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wheel */}
          <div className="relative w-80 h-80 mx-auto">
            <motion.div
              className="w-full h-full rounded-full border-8 border-gray-300 relative overflow-hidden"
              animate={{ rotate: rotation }}
              transition={{ duration: 4, ease: "easeOut" }}
            >
              {prizes.map((prize, index) => {
                const angle = (360 / prizes.length) * index
                return (
                  <div
                    key={prize.id}
                    className="absolute w-full h-full"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((360 / prizes.length) * Math.PI) / 180)}% ${50 - 50 * Math.sin(((360 / prizes.length) * Math.PI) / 180)}%)`,
                      backgroundColor: prize.color,
                    }}
                  >
                    <div
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-center"
                      style={{ transform: `translateX(-50%) rotate(${360 / prizes.length / 2}deg)` }}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        {prize.icon}
                        <span className="text-xs font-bold">{prize.name}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </motion.div>

            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center">
            <Button
              onClick={handleSpin}
              disabled={!canSpin || isSpinning}
              size="lg"
              className="px-8 py-3 text-lg font-bold"
            >
              {isSpinning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="mr-2"
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
              ) : null}
              {isSpinning ? "جاري الدوران..." : canSpin ? "دوّر العجلة!" : `انتظر ${timeLeft} ساعة`}
            </Button>
          </div>

          {/* Last Prize */}
          <AnimatePresence>
            {lastPrize && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center p-4 rounded-lg bg-muted"
              >
                <p className="text-sm text-muted-foreground">آخر جائزة:</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  {lastPrize.icon}
                  <span className="font-semibold">{lastPrize.name}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Prizes Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">الجوائز المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prizes.map((prize) => (
              <div
                key={prize.id}
                className="flex items-center gap-3 p-3 rounded-lg border"
                style={{ borderColor: prize.color }}
              >
                <div style={{ color: prize.color }}>{prize.icon}</div>
                <div className="flex-1">
                  <p className="font-medium">{prize.name}</p>
                  <p className="text-sm text-muted-foreground">{prize.probability}% احتمالية</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
