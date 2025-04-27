"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"

export function SimpleDevexCalculator() {
  // حالة الإدخال
  const [calculationType, setCalculationType] = useState<"robux-to-usd" | "usd-to-robux">("robux-to-usd")
  const [robuxAmount, setRobuxAmount] = useState<number>(100000)
  const [usdAmount, setUsdAmount] = useState<number>(350)
  const [exchangeRate] = useState<number>(0.0035) // سعر الصرف الثابت: 1 روبوكس = 0.0035 دولار

  // حالة النتائج
  const [convertedAmount, setConvertedAmount] = useState<number>(0)
  const [minimumRequired, setMinimumRequired] = useState<number>(0)

  // حساب النتائج عند تغيير المدخلات
  useEffect(() => {
    if (calculationType === "robux-to-usd") {
      // تحويل الروبوكس إلى دولار
      const usdValue = robuxAmount * exchangeRate
      setConvertedAmount(usdValue)
      setMinimumRequired(100000) // الحد الأدنى للتحويل هو 100,000 روبوكس
    } else {
      // تحويل الدولار إلى روبوكس
      const robuxValue = usdAmount / exchangeRate
      setConvertedAmount(robuxValue)
      setMinimumRequired(350) // الحد الأدنى للتحويل هو 350 دولار
    }
  }, [robuxAmount, usdAmount, exchangeRate, calculationType])

  // تنسيق الأرقام
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: decimals })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden shadow-lg border-primary/20">
        <CardContent className="p-6">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6 mb-6">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent opacity-60"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">حاسبة تحويل DevEx</h2>
                <p className="text-sm text-muted-foreground">
                  تحويل الروبوكس إلى دولار أمريكي والعكس (سعر الصرف: {exchangeRate} دولار لكل روبوكس)
                </p>
              </div>
            </div>
          </div>

          <Tabs value={calculationType} onValueChange={(value: any) => setCalculationType(value)} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="robux-to-usd">روبوكس إلى دولار</TabsTrigger>
              <TabsTrigger value="usd-to-robux">دولار إلى روبوكس</TabsTrigger>
            </TabsList>

            <TabsContent value="robux-to-usd" className="mt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="robux-amount" className="text-lg">
                  مبلغ الروبوكس
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="robux-amount"
                    type="number"
                    min={100000}
                    step={1000}
                    value={robuxAmount}
                    onChange={(e) => setRobuxAmount(Number.parseInt(e.target.value) || 0)}
                    className="text-lg"
                  />
                  <span className="text-lg font-bold text-primary">R$</span>
                </div>
                {robuxAmount < 100000 && (
                  <p className="text-xs text-destructive">الحد الأدنى للتحويل هو 100,000 روبوكس</p>
                )}
              </div>

              <motion.div
                className="space-y-2 rounded-lg bg-gradient-to-br from-background to-muted/30 p-6 text-center shadow-sm border border-green-500/10"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(34,197,94,0.2)" }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-lg font-medium text-muted-foreground">المبلغ بالدولار الأمريكي</p>
                <p className="text-4xl font-bold text-green-600">${formatNumber(convertedAmount)}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatNumber(robuxAmount, 0)} روبوكس = ${formatNumber(convertedAmount)}
                </p>
              </motion.div>
            </TabsContent>

            <TabsContent value="usd-to-robux" className="mt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="usd-amount" className="text-lg">
                  المبلغ بالدولار
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="usd-amount"
                    type="number"
                    min={350}
                    step={10}
                    value={usdAmount}
                    onChange={(e) => setUsdAmount(Number.parseFloat(e.target.value) || 0)}
                    className="text-lg"
                  />
                  <span className="text-lg font-bold text-green-600">$</span>
                </div>
                {usdAmount < 350 && <p className="text-xs text-destructive">الحد الأدنى للتحويل هو 350 دولار أمريكي</p>}
              </div>

              <motion.div
                className="space-y-2 rounded-lg bg-gradient-to-br from-background to-muted/30 p-6 text-center shadow-sm border border-green-500/10"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(34,197,94,0.2)" }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-lg font-medium text-muted-foreground">المبلغ بالروبوكس</p>
                <p className="text-4xl font-bold text-primary">{formatNumber(convertedAmount, 0)} R$</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  ${formatNumber(usdAmount)} = {formatNumber(convertedAmount, 0)} روبوكس
                </p>
              </motion.div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="text-sm">
              <span className="font-medium">ملاحظة مهمة:</span>{" "}
              {calculationType === "robux-to-usd"
                ? `الحد الأدنى للتحويل هو 100,000 روبوكس. قد تختلف الأسعار الفعلية حسب سياسة Roblox.`
                : `الحد الأدنى للتحويل هو 350 دولار أمريكي. قد تختلف الأسعار الفعلية حسب سياسة Roblox.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
