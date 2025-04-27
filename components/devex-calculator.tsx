"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { ArrowRight, CreditCard, HelpCircle, Calculator } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DevexCalculator() {
  // حالة الإدخال
  const [calculationType, setCalculationType] = useState<"robux-to-usd" | "usd-to-robux">("robux-to-usd")
  const [robuxAmount, setRobuxAmount] = useState<number>(100000)
  const [usdAmount, setUsdAmount] = useState<number>(350)
  const [exchangeRate, setExchangeRate] = useState<number>(0.0035) // سعر الصرف الافتراضي: 1 روبوكس = 0.0035 دولار
  const [taxRate, setTaxRate] = useState<number>(30) // معدل الضريبة الافتراضي: 30%
  const [currency, setCurrency] = useState<string>("USD")

  // حالة النتائج
  const [convertedAmount, setConvertedAmount] = useState<number>(0)
  const [taxAmount, setTaxAmount] = useState<number>(0)
  const [netAmount, setNetAmount] = useState<number>(0)
  const [minimumRequired, setMinimumRequired] = useState<number>(0)

  // معدلات تحويل العملات (بالنسبة للدولار الأمريكي)
  const currencyRates: Record<string, number> = {
    USD: 1,
    EUR: 0.93,
    GBP: 0.79,
    CAD: 1.37,
    AUD: 1.53,
    SAR: 3.75, // ريال سعودي
  }

  // حساب النتائج عند تغيير المدخلات
  useEffect(() => {
    if (calculationType === "robux-to-usd") {
      // تحويل الروبوكس إلى دولار
      const usdValue = robuxAmount * exchangeRate
      const taxValue = usdValue * (taxRate / 100)
      const netValue = usdValue - taxValue

      // تحويل إلى العملة المحددة
      const currencyRate = currencyRates[currency] || 1
      const convertedValue = usdValue / currencyRate
      const taxValueConverted = taxValue / currencyRate
      const netValueConverted = netValue / currencyRate

      setConvertedAmount(convertedValue)
      setTaxAmount(taxValueConverted)
      setNetAmount(netValueConverted)
      setMinimumRequired(100000) // الحد الأدنى للتحويل هو 100,000 روبوكس
    } else {
      // تحويل الدولار إلى روبوكس
      const currencyRate = currencyRates[currency] || 1
      const usdValue = usdAmount * currencyRate

      // حساب الروبوكس قبل الضرائب
      const robuxBeforeTax = usdValue / exchangeRate

      // حساب الضرائب والمبلغ الصافي
      const taxValue = usdValue * (taxRate / 100)
      const netValue = usdValue - taxValue

      setConvertedAmount(robuxBeforeTax)
      setTaxAmount(taxValue)
      setNetAmount(netValue)
      setMinimumRequired(350) // الحد الأدنى للتحويل هو 350 دولار
    }
  }, [robuxAmount, usdAmount, exchangeRate, taxRate, currency, calculationType])

  // تنسيق الأرقام
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: decimals })
  }

  // تنسيق العملة
  const formatCurrency = (amount: number, currencyCode: string) => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "C$",
      AUD: "A$",
      SAR: "ر.س",
    }

    return `${symbols[currencyCode] || ""}${formatNumber(amount)}`
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            حاسبة تحويل DevEx
          </CardTitle>
          <CardDescription>تحويل الروبوكس إلى عملات حقيقية وحساب الضرائب والرسوم</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={calculationType} onValueChange={(value: any) => setCalculationType(value)} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="robux-to-usd">تحويل الروبوكس إلى عملة</TabsTrigger>
              <TabsTrigger value="usd-to-robux">تحويل العملة إلى روبوكس</TabsTrigger>
            </TabsList>

            <TabsContent value="robux-to-usd" className="mt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="robux-amount">مبلغ الروبوكس</Label>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="exchange-rate">سعر الصرف (لكل روبوكس)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="exchange-rate"
                      type="number"
                      min={0.001}
                      max={0.01}
                      step={0.0001}
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(Number.parseFloat(e.target.value) || 0)}
                      className="text-lg"
                    />
                    <span className="text-lg font-bold text-green-600">$</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="currency-select">العملة</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>اختر العملة التي تريد تحويل الروبوكس إليها</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency-select">
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                      <SelectItem value="EUR">يورو (EUR)</SelectItem>
                      <SelectItem value="GBP">جنيه إسترليني (GBP)</SelectItem>
                      <SelectItem value="CAD">دولار كندي (CAD)</SelectItem>
                      <SelectItem value="AUD">دولار أسترالي (AUD)</SelectItem>
                      <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tax-rate">معدل الضريبة (%)</Label>
                  <span className="text-sm font-medium">{taxRate}%</span>
                </div>
                <Slider
                  id="tax-rate"
                  min={0}
                  max={50}
                  step={1}
                  value={[taxRate]}
                  onValueChange={(value) => setTaxRate(value[0])}
                />
                <p className="text-xs text-muted-foreground">تختلف معدلات الضريبة حسب البلد والمنطقة</p>
              </div>
            </TabsContent>

            <TabsContent value="usd-to-robux" className="mt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="usd-amount">المبلغ بالعملة</Label>
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
                  <span className="text-lg font-bold text-green-600">{currency}</span>
                </div>
                {usdAmount < 350 && (
                  <p className="text-xs text-destructive">الحد الأدنى للتحويل هو 350 دولار أمريكي أو ما يعادله</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="exchange-rate-usd">سعر الصرف (لكل روبوكس)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="exchange-rate-usd"
                      type="number"
                      min={0.001}
                      max={0.01}
                      step={0.0001}
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(Number.parseFloat(e.target.value) || 0)}
                      className="text-lg"
                    />
                    <span className="text-lg font-bold text-green-600">$</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="currency-select-usd">العملة</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>اختر العملة التي تريد تحويلها إلى روبوكس</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency-select-usd">
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                      <SelectItem value="EUR">يورو (EUR)</SelectItem>
                      <SelectItem value="GBP">جنيه إسترليني (GBP)</SelectItem>
                      <SelectItem value="CAD">دولار كندي (CAD)</SelectItem>
                      <SelectItem value="AUD">دولار أسترالي (AUD)</SelectItem>
                      <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tax-rate-usd">معدل الضريبة (%)</Label>
                  <span className="text-sm font-medium">{taxRate}%</span>
                </div>
                <Slider
                  id="tax-rate-usd"
                  min={0}
                  max={50}
                  step={1}
                  value={[taxRate]}
                  onValueChange={(value) => setTaxRate(value[0])}
                />
                <p className="text-xs text-muted-foreground">تختلف معدلات الضريبة حسب البلد والمنطقة</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="rounded-lg bg-gradient-to-r from-green-500/5 to-blue-500/5 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 rounded-lg bg-background p-4 text-center shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">
                  {calculationType === "robux-to-usd" ? "المبلغ المحول" : "الروبوكس المكافئ"}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {calculationType === "robux-to-usd"
                    ? formatCurrency(convertedAmount, currency)
                    : `${formatNumber(convertedAmount, 0)} R$`}
                </p>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                  <span>قبل الضرائب</span>
                </div>
              </div>

              <div className="space-y-2 rounded-lg bg-background p-4 text-center shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">الضرائب والرسوم</p>
                <p className="text-2xl font-bold text-destructive">
                  {calculationType === "robux-to-usd"
                    ? formatCurrency(taxAmount, currency)
                    : formatCurrency(taxAmount, currency)}
                </p>
                <p className="text-xs text-muted-foreground">({taxRate}%)</p>
              </div>

              <div className="space-y-2 rounded-lg bg-background p-4 text-center shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">المبلغ الصافي</p>
                <p className="text-2xl font-bold text-green-600">
                  {calculationType === "robux-to-usd"
                    ? formatCurrency(netAmount, currency)
                    : formatCurrency(netAmount, currency)}
                </p>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                  <span>بعد الضرائب</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <p className="font-medium">ملخص التحويل:</p>
              </div>

              {calculationType === "robux-to-usd" ? (
                <p className="mt-2 text-sm">
                  {formatNumber(robuxAmount, 0)} روبوكس = {formatCurrency(convertedAmount, currency)} (قبل الضرائب)
                  <br />
                  بعد خصم الضرائب ({taxRate}%)، ستحصل على {formatCurrency(netAmount, currency)} صافي.
                  {robuxAmount < 100 && (
                    <span className="mt-2 block text-destructive">ملاحظة: الحد الأدنى للتحويل هو 100,000 روبوكس.</span>
                  )}
                </p>
              ) : (
                <p className="mt-2 text-sm">
                  {formatCurrency(usdAmount, currency)} = {formatNumber(convertedAmount, 0)} روبوكس (بسعر صرف{" "}
                  {exchangeRate} دولار لكل روبوكس)
                  <br />
                  بعد خصم الضرائب ({taxRate}%)، ستحصل على {formatCurrency(netAmount, currency)} صافي.
                  {usdAmount < 5 && (
                    <span className="mt-2 block text-destructive">
                      ملاحظة: الحد الأدنى للتحويل هو 350 دولار أمريكي أو ما يعادله.
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
