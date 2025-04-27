"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"
// استيراد أيقونة Discord الجديدة
import { DiscordIconFA } from "./discord-icon-fa"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // في تطبيق حقيقي، هنا سنرسل البريد الإلكتروني إلى الخادم
      console.log("Subscribed with email:", email)
      setIsSubscribed(true)
      setEmail("")
    }
  }

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image src="https://i.ibb.co/jPM95k76/image.png" alt="Logo" fill className="object-cover" />
              </div>
              <h3 className="text-lg font-bold">متجر روبلوكس</h3>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              منصة لشراء وبيع منتجات Roblox بسهولة وأمان. نوفر مكانًا آمنًا للمطورين للتواصل وتبادل المنتجات.
            </p>
            <div className="mt-4 flex gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" asChild>
                <Link href="https://discord.gg/aia" target="_blank" rel="noopener noreferrer">
                  {/* تغيير هذا السطر:
                  <DiscordIcon className="h-4 w-4" />
                  // إلى: */}
                  <DiscordIconFA className="h-4 w-4" />
                  <span className="sr-only">Discord</span>
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">روابط سريعة</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/assets" className="text-muted-foreground transition-colors hover:text-primary">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-primary">
                  لوحة التحكم
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground transition-colors hover:text-primary">
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">الفئات</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/assets?category=mm2"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  ام ام تو
                </Link>
              </li>
              <li>
                <Link
                  href="/assets?category=robux"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  روبوكس
                </Link>
              </li>
              <li>
                <Link
                  href="/assets?category=accounts"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  حسابات
                </Link>
              </li>
              <li>
                <Link
                  href="/assets?category=development"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  تطوير
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>غير متوفر حاليا</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                {/* وأيضًا في قسم التواصل معنا:
                <DiscordIcon className="h-4 w-4 text-primary" />
                // إلى: */}
                <DiscordIconFA className="h-4 w-4 text-primary" />
                <Link
                  href="https://discord.gg/aia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  انضم إلى سيرفر Discord
                </Link>
              </li>
            </ul>

            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium">اشترك في آخر التحديثات</h4>
              {isSubscribed ? (
                <div className="rounded-lg bg-primary/10 p-3 text-sm text-primary">
                  تم الاشتراك بنجاح! سنرسل لك آخر التحديثات.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    className="h-9 bg-background"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" size="sm" className="h-9">
                    اشترك
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} متجر روبلوكس. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
