"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { ArrowRight, Calculator, Percent, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function RobuxCalculator() {
  // حالة الإدخال
  const [robuxAmount, setRobuxAmount] = useState<number>(1000)
  const [marketplaceFee, setMarketplaceFee] = useState<number>(30)
  const [isPremium, setIsPremium] = useState<boolean>(true)
  const [calculationType, setCalculationType] = useState<"marketplace" | "gamepass" | "developerproduct">("marketplace")

  // حالة النتائج
  const [netRobux, setNetRobux] = useState<number>(0)
  const [feeAmount, setFeeAmount] = useState<number>(0)
  const [recommendedPrice, setRecommendedPrice] = useState<number>(0)

  // حساب النتائج عند تغيير المدخلات
  useEffect(() => {
    let fee = marketplaceFee

    // تعديل الرسوم بناءً على نوع الحساب
    if (calculationType === "gamepass" || calculationType === "developerproduct") {
      fee = 30 // رسوم ثابتة للـ Game Pass و Developer Products
    }

    // تعديل الرسوم بناءً على حالة Premium
    if (isPremium && calculationType === "marketplace") {
      fee = Math.max(10, fee - 10) // تخفيض 10% للمستخدمين المميزين، بحد أدنى 10%
    }

    // حساب الرسوم والمبلغ الصافي
    const feeDecimal = fee / 100
    const feeAmountCalc = Math.floor(robuxAmount * feeDecimal)
    const netRobuxCalc = robuxAmount - feeAmountCalc

    // حساب السعر الموصى به للحصول على مبلغ محدد
    const recommendedPriceCalc = Math.ceil(robuxAmount / (1 - feeDecimal))

    setFeeAmount(feeAmountCalc)
    setNetRobux(netRobuxCalc)
    setRecommendedPrice(recommendedPriceCalc)
  }, [robuxAmount, marketplaceFee, isPremium, calculationType])

  // تنسيق الأرقام
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US")
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            حاسبة ضرائب الروبوكس
          </CardTitle>
          <CardDescription>حساب الضرائب والرسوم المفروضة على مبيعات الروبوكس بدقة</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={calculationType} onValueChange={(value: any) => setCalculationType(value)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="marketplace">سوق المنتجات</TabsTrigger>
              <TabsTrigger value="gamepass">Game Pass</TabsTrigger>
              <TabsTrigger value="developerproduct">Developer Product</TabsTrigger>
            </TabsList>

            <TabsContent value="marketplace" className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="premium-switch">حساب Premium</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>مستخدمو Premium يحصلون على خصم 10% من رسوم السوق</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch id="premium-switch" checked={isPremium} onCheckedChange={setIsPremium} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketplace-fee">نسبة رسوم السوق (%)</Label>
                  <span className="text-sm font-medium">{marketplaceFee}%</span>
                </div>
                <Slider
                  id="marketplace-fee"
                  min={0}
                  max={90}
                  step={1}
                  value={[marketplaceFee]}
                  onValueChange={(value) => setMarketplaceFee(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  {isPremium ? `الرسوم الفعلية: ${Math.max(10, marketplaceFee - 10)}% (بعد خصم Premium)` : ""}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="gamepass" className="mt-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary" />
                  <p className="font-medium">رسوم Game Pass ثابتة: 30%</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  تفرض Roblox رسومًا ثابتة بنسبة 30% على جميع مبيعات Game Pass
                </p>
              </div>
            </TabsContent>

            <TabsContent value="developerproduct" className="mt-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary" />
                  <p className="font-medium">رسوم Developer Product ثابتة: 30%</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  تفرض Roblox رسومًا ثابتة بنسبة 30% على جميع مبيعات Developer Products
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="robux-amount">مبلغ الروبوكس</Label>
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

            <div className="rounded-lg bg-gradient-to-r from-primary/5 to-purple-500/5 p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 rounded-lg bg-background p-4 text-center shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">الرسوم</p>
                  <p className="text-2xl font-bold text-destructive">{formatNumber(feeAmount)} R$</p>
                  <p className="text-xs text-muted-foreground">
                    (
                    {calculationType === "marketplace"
                      ? isPremium
                        ? Math.max(10, marketplaceFee - 10)
                        : marketplaceFee
                      : 30}
                    %)
                  </p>
                </div>

                <div className="space-y-2 rounded-lg bg-background p-4 text-center shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">المبلغ الصافي</p>
                  <p className="text-2xl font-bold text-primary">{formatNumber(netRobux)} R$</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <ArrowRight className="h-3 w-3" />
                    <span>ما ستحصل عليه</span>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg bg-background p-4 text-center shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">سعر عشان توصل كاملة</p>
                  <p className="text-2xl font-bold text-green-600">{formatNumber(recommendedPrice)} R$</p>
                  <p className="text-xs text-muted-foreground">للحصول على {formatNumber(robuxAmount)} R$</p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-muted p-4">
                <p className="text-sm">
                  <span className="font-medium">ملخص:</span> إذا قمت ببيع منتج بسعر {formatNumber(robuxAmount)} R$،
                  فستدفع {formatNumber(feeAmount)} R$ كرسوم (
                  {calculationType === "marketplace"
                    ? isPremium
                      ? Math.max(10, marketplaceFee - 10)
                      : marketplaceFee
                    : 30}
                  %)، وستحصل على {formatNumber(netRobux)} R$ صافي.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
