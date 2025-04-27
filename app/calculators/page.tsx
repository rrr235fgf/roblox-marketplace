"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleRobuxCalculator } from "@/components/simple-robux-calculator"
import { SimpleDevexCalculator } from "@/components/simple-devex-calculator"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/loading-spinner"
import { motion } from "framer-motion"
import { LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CalculatorsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("gamepass")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container flex flex-1 flex-col items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <LockKeyhole className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">محتوى محمي</h1>
            <p className="mb-6 max-w-md text-muted-foreground">
              يجب عليك تسجيل الدخول للوصول إلى أدوات الحساب المتقدمة الخاصة بالروبوكس
            </p>
            <Button onClick={() => router.push("/login")}>تسجيل الدخول</Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container flex-1 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">حسابات الضرائب</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">أدوات مفيدة لحساب ضرائب الروبوكس وتحويل DevEx</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-3xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gamepass">ضرائب القيم باس</TabsTrigger>
            <TabsTrigger value="devex">تحويل DevEx</TabsTrigger>
          </TabsList>
          <TabsContent value="gamepass" className="mt-6">
            <SimpleRobuxCalculator />
          </TabsContent>
          <TabsContent value="devex" className="mt-6">
            <SimpleDevexCalculator />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
