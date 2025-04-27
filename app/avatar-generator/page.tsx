"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RobloxAvatarGenerator } from "@/components/roblox-avatar-generator"
import { motion } from "framer-motion"

export default function AvatarGeneratorPage() {
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
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">مولد صور شخصيات روبلوكس</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            أدخل اسم المستخدم الخاص بك في روبلوكس وسنقوم بإنشاء صورة مخصصة لشخصيتك
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <RobloxAvatarGenerator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
