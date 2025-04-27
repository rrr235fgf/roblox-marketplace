"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AccountInfoSearch } from "@/components/account-info-search"
import { AccountInfoDisplay } from "@/components/account-info-display"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

export default function AccountInfoPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchedUser, setSearchedUser] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // تنظيف الخطأ عند تغيير الصفحة
    return () => {
      setError(null)
    }
  }, [])

  const handleSearch = (userData: any) => {
    try {
      setSearchedUser(userData)
      setError(null)
    } catch (err) {
      console.error("Error handling search result:", err)
      setError("حدث خطأ أثناء معالجة نتائج البحث")
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء معالجة نتائج البحث",
        variant: "destructive",
      })
    }
  }

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
    return null
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
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">معلومات الحساب</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">ابحث عن معلومات حساب مستخدم في منصة روبلوكس</p>
        </motion.div>

        <AccountInfoSearch onSearch={handleSearch} isSearching={isSearching} setIsSearching={setIsSearching} />

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-lg bg-destructive/10 p-4 text-center text-destructive"
          >
            {error}
          </motion.div>
        )}

        {searchedUser && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <AccountInfoDisplay user={searchedUser} />
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  )
}
