"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft, Star, Users, ShieldCheck } from "lucide-react"

export function LandingHero() {
  const { user } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const images = ["https://i.ibb.co/k2M1vHL0/trading-mm2-weapons-for-rh-halos-items-and-diamonds-pls-v0-3gfc7k0b4p9b1.png"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-24">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(var(--primary-rgb),0.12),transparent)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-32 w-32 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 text-center md:text-right"
          >
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary md:justify-start">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                اول منصة عربية لبيع جميع مايخص التطوير
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                سوق منتجات
                <span className="bg-gradient-to-l from-primary to-purple-400 bg-clip-text text-transparent">
                  {" "}
                  Roblox
                </span>
              </h1>
              <p className="mt-2 text-xl text-muted-foreground">
                اشتري وبيع منتجات روبلوكس مثل: ام ام تو, روبوكس, حسابات, كل مايخص التطوير
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-background">
                    <Image
                      src="https://i.ibb.co/YTh4kMFR/New-Project-1.png"
                      alt="User 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-background">
                    <Image src="https://i.ibb.co/GQLmt5Yr/ima-ge.png" alt="User 2" fill className="object-cover" />
                  </div>
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-background">
                    <Image
                      src="https://i.ibb.co/WN6xD4sw/057052573c12b4957bce8fed6be5f4d4.png"
                      alt="User 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">انضم إلينا العديد من المستخدمين</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
              <Button asChild size="lg" className="gap-2 rounded-full px-8 text-base font-medium">
                <Link href={user ? "/dashboard" : "/login"}>
                  {user ? "استعرض المنتجات" : "ابدأ الآن"}
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 rounded-full px-8 text-base font-medium">
                <Link href="/assets">استكشف المنتجات</Link>
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center rounded-xl bg-background p-3 shadow-sm">
                <Users className="mb-2 h-6 w-6 text-primary" />
                <p className="text-sm font-medium">مجتمع نشط</p>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-background p-3 shadow-sm">
                <ShieldCheck className="mb-2 h-6 w-6 text-primary" />
                <p className="text-sm font-medium">تعاملات آمنة</p>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-background p-3 shadow-sm">
                <Star className="mb-2 h-6 w-6 text-primary" />
                <p className="text-sm font-medium">منتجات مميزة</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto aspect-[4/3] w-full max-w-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-xl" />
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/40 bg-background/50 p-1 shadow-2xl backdrop-blur-sm">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                {images.map((src, index) => (
                  <Image
                    key={index}
                    src={src || "https://i.ibb.co/k2M1vHL0/trading-mm2-weapons-for-rh-halos-items-and-diamonds-pls-v0-3gfc7k0b4p9b1.png"}
                    alt="Roblox Game Screenshot"
                    fill
                    className={`object-cover transition-all duration-1000 ease-in-out ${
                      currentImage === index ? "opacity-100 scale-100" : "opacity-0 scale-110"
                    }`}
                  />
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                      <Image src="https://i.ibb.co/DDWRsG0p/image.png" alt="Creator" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">اسلحة ام ام تو</p>
                      <p className="text-xs opacity-80">بواسطة j4_1</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary/80 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                      100 روبوكس
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 h-12 w-12 rounded-full bg-primary/30 blur-xl" />
            <div className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-purple-500/30 blur-lg" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
