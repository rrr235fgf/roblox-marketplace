"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال بريد إلكتروني صالح",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء الاشتراك")
      }

      setIsSubmitted(true)
      setEmail("")

      toast({
        title: "تم الاشتراك بنجاح",
        description: "سنرسل لك آخر التحديثات قريبًا",
      })
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء الاشتراك",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">اشترك في آخر التحديثات</h2>
            <p className="mb-6 text-muted-foreground">
              احصل على آخر الأخبار والتحديثات حول منتجات Roblox الجديدة والعروض الخاصة
            </p>

            {isSubmitted ? (
              <div className="flex flex-col items-center gap-2 rounded-lg bg-primary/10 p-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                <p className="font-medium text-primary">تم الاشتراك بنجاح!</p>
                <p className="text-sm text-muted-foreground">سنرسل لك آخر التحديثات قريبًا.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-full border-primary/20 bg-background px-4"
                  required
                  disabled={isLoading}
                />
                <Button type="submit" className="h-12 rounded-full px-6" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الاشتراك...
                    </>
                  ) : (
                    "اشترك الآن"
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
