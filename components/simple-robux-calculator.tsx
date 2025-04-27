"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Calculator } from "lucide-react"

export function SimpleRobuxCalculator() {
  // حالة الإدخال
  const [robuxAmount, setRobuxAmount] = useState<number>(1000)

  // حالة النتائج
  const [netRobux, setNetRobux] = useState<number>(0)
  const [feeAmount, setFeeAmount] = useState<number>(0)
  const [recommendedPrice, setRecommendedPrice] = useState<number>(0)

  // حساب النتائج عند تغيير المدخلات
  useEffect(() => {
    // رسوم ثابتة للـ Game Pass (30%)
    const fee = 30

    // حساب الرسوم والمبلغ الصافي
    const feeDecimal = fee / 100
    const feeAmountCalc = Math.floor(robuxAmount * feeDecimal)
    const netRobuxCalc = robuxAmount - feeAmountCalc

    // حساب السعر الموصى به للحصول على مبلغ محدد
    const recommendedPriceCalc = Math.ceil(robuxAmount / (1 - feeDecimal))

    setFeeAmount(feeAmountCalc)
    setNetRobux(netRobuxCalc)
    setRecommendedPrice(recommendedPriceCalc)
  }, [robuxAmount])

  // تنسيق الأرقام
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US")
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden shadow-lg border-primary/20">
        <CardContent className="p-6">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 mb-6">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">حاسبة ضرائب القيم باس</h2>
                <p className="text-sm text-muted-foreground">
                  تفرض Roblox رسومًا ثابتة بنسبة 30% على جميع مبيعات Game Pass
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="robux-amount" className="text-lg">
                مبلغ الروبوكس
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="robux-amount"
                  type="number"
                  min={1}
                  value={robuxAmount}
                  onChange={(e) => setRobuxAmount(Number.parseInt(e.target.value) || 0)}
                  className="text-lg"
                />
                <span className="text-lg font-bold text-primary">R$</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <motion.div
                className="space-y-2 rounded-lg bg-gradient-to-br from-background to-muted/30 p-4 text-center shadow-sm border border-primary/10"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(var(--primary-rgb), 0.2)" }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm font-medium text-muted-foreground">الرسوم (30%)</p>
                <p className="text-2xl font-bold text-destructive">{formatNumber(feeAmount)} R$</p>
              </motion.div>

              <motion.div
                className="space-y-2 rounded-lg bg-gradient-to-br from-background to-muted/30 p-4 text-center shadow-sm border border-primary/10"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(var(--primary-rgb), 0.2)" }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm font-medium text-muted-foreground">المبلغ الصافي</p>
                <p className="text-2xl font-bold text-primary">{formatNumber(netRobux)} R$</p>
              </motion.div>

              <motion.div
                className="space-y-2 rounded-lg bg-gradient-to-br from-background to-muted/30 p-4 text-center shadow-sm border border-primary/10"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(var(--primary-rgb), 0.2)" }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm font-medium text-muted-foreground">السعر الموصى به</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(recommendedPrice)} R$</p>
              </motion.div>
            </div>

            <div className="mt-6 rounded-lg bg-muted p-4">
              <p className="text-sm">
                <span className="font-medium">ملخص:</span> إذا قمت ببيع منتج بسعر {formatNumber(robuxAmount)} R$، فستدفع{" "}
                {formatNumber(feeAmount)} R$ كرسوم (30%)، وستحصل على {formatNumber(netRobux)} R$ صافي.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
