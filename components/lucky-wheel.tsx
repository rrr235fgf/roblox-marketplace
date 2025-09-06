"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Gift, Trophy, Coins, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Prize {
  id: string
  name: string
  type: "robux" | "account" | "item" | "nothing"
  value?: number
  probability: number
  color: string
  icon: React.ReactNode
}

const prizes: Prize[] = [
  {
    id: "robux-100",
    name: "100 روبوكس",
    type: "robux",
    value: 100,
    probability: 0.15,
    color: "#10B981",
    icon: <Coins className="h-6 w-6" />,
  },
  {
    id: "account",
    name: "حساب مجاني",
    type: "account",
    probability: 0.05,
    color: "#8B5CF6",
    icon: <Trophy className="h-6 w-6" />,
  },
  {
    id: "item",
    name: "عنصر نادر",
    type: "item",
    probability: 0.2,
    color: "#F59E0B",
    icon: <Gift className="h-6 w-6" />,
  },
  {
    id: "nothing",
    name: "حظ أوفر المرة القادمة",
    type: "nothing",
    probability: 0.6,
    color: "#6B7280",
    icon: <Star className="h-6 w-6" />,
  },
]

export function LuckyWheel() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [canSpin, setCanSpin] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const lastSpin = localStorage.getItem("lastWheelSpin")
    if (lastSpin) {
      const timeDiff = Date.now() - Number.parseInt(lastSpin)
      const hoursLeft = 24 - Math.floor(timeDiff / (1000 * 60 * 60))

      if (hoursLeft > 0) {
        setCanSpin(false)
        setTimeLeft(hoursLeft)

        const interval = setInterval(() => {
          const newTimeDiff = Date.now() - Number.parseInt(lastSpin)
          const newHoursLeft = 24 - Math.floor(newTimeDiff / (1000 * 60 * 60))

          if (newHoursLeft <= 0) {
            setCanSpin(true)
            setTimeLeft(0)
            clearInterval(interval)
          } else {
            setTimeLeft(newHoursLeft)
          }
        }, 60000)

        return () => clearInterval(interval)
      }
    }
  }, [])

  const spinWheel = () => {
    if (!canSpin || isSpinning) return

    setIsSpinning(true)

    // Generate random prize based on probabilities
    const random = Math.random()
    let cumulativeProbability = 0
    let wonPrize = prizes[prizes.length - 1] // Default to "nothing"

    for (const prize of prizes) {
      cumulativeProbability += prize.probability
      if (random <= cumulativeProbability) {
        wonPrize = prize
        break
      }
    }

    // Calculate rotation
    const spins = 5 + Math.random() * 5 // 5-10 full rotations
    const prizeIndex = prizes.findIndex((p) => p.id === wonPrize.id)
    const prizeAngle = (360 / prizes.length) * prizeIndex
    const finalRotation = rotation + spins * 360 + prizeAngle

    setRotation(finalRotation)

    setTimeout(() => {
      setSelectedPrize(wonPrize)
      setIsSpinning(false)
      setCanSpin(false)

      // Store spin time
      localStorage.setItem("lastWheelSpin", Date.now().toString())
      setTimeLeft(24)

      // Show result
      if (wonPrize.type === "nothing") {
        toast.error("حظ أوفر المرة القادمة! 😔")
      } else {
        toast.success(`تهانينا! لقد ربحت: ${wonPrize.name} 🎉`)
      }
    }, 3000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">عجلة الحظ</CardTitle>
          <p className="text-muted-foreground">اربح جوائز مذهلة! يمكنك اللعب مرة واحدة كل 24 ساعة</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wheel */}
          <div className="relative mx-auto w-80 h-80">
            <motion.div
              className="w-full h-full rounded-full border-8 border-primary relative overflow-hidden"
              animate={{ rotate: rotation }}
              transition={{ duration: 3, ease: "easeOut" }}
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
                    }}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: prize.color }}
                    >
                      <div className="text-white text-center transform -rotate-45">
                        {prize.icon}
                        <p className="text-xs font-bold mt-1">{prize.name}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </motion.div>

            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center space-y-4">
            <Button
              onClick={spinWheel}
              disabled={!canSpin || isSpinning}
              size="lg"
              className="px-8 py-3 text-lg font-bold"
            >
              {isSpinning ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  جاري الدوران...
                </>
              ) : canSpin ? (
                "ادر العجلة!"
              ) : (
                `انتظر ${timeLeft} ساعة`
              )}
            </Button>

            {!canSpin && !isSpinning && (
              <p className="text-sm text-muted-foreground">يمكنك اللعب مرة أخرى بعد {timeLeft} ساعة</p>
            )}
          </div>

          {/* Prize Display */}
          <AnimatePresence>
            {selectedPrize && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {selectedPrize.icon}
                  <h3 className="text-xl font-bold">{selectedPrize.name}</h3>
                </div>
                {selectedPrize.type !== "nothing" && (
                  <Badge variant="secondary" className="mt-2">
                    تهانينا! 🎉
                  </Badge>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prizes List */}
          <div className="space-y-2">
            <h4 className="font-semibold text-center">الجوائز المتاحة:</h4>
            <div className="grid grid-cols-2 gap-2">
              {prizes.map((prize) => (
                <div
                  key={prize.id}
                  className="flex items-center gap-2 p-2 rounded-lg border"
                  style={{ borderColor: prize.color }}
                >
                  {prize.icon}
                  <div>
                    <p className="text-sm font-medium">{prize.name}</p>
                    <p className="text-xs text-muted-foreground">{(prize.probability * 100).toFixed(0)}% احتمالية</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
