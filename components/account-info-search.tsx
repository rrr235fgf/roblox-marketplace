"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Search, User, History } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

interface AccountInfoSearchProps {
  onSearch: (user: any) => void
  isSearching: boolean
  setIsSearching: (isSearching: boolean) => void
}

export function AccountInfoSearch({ onSearch, isSearching, setIsSearching }: AccountInfoSearchProps) {
  const [username, setUsername] = useState("")
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    // استرجاع سجل البحث من التخزين المحلي عند تحميل المكون
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("robloxSearchHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // حفظ اسم المستخدم في سجل البحث
  const saveToHistory = (name: string) => {
    const newHistory = [name, ...searchHistory.filter((item) => item !== name)].slice(0, 5)
    setSearchHistory(newHistory)

    if (typeof window !== "undefined") {
      localStorage.setItem("robloxSearchHistory", JSON.stringify(newHistory))
    }
  }

  const handleSearch = async (e: React.FormEvent, searchName: string = username) => {
    e.preventDefault()

    const nameToSearch = searchName.trim()

    if (!nameToSearch) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المستخدم",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)

    try {
      // حفظ اسم المستخدم في سجل البحث
      saveToHistory(nameToSearch)

      const response = await fetch(`/api/roblox/user?username=${encodeURIComponent(nameToSearch)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "فشل البحث عن المستخدم")
      }

      const userData = await response.json()
      onSearch(userData)

      toast({
        title: "تم العثور على المستخدم",
        description: "تم جلب معلومات المستخدم بنجاح",
      })
    } catch (error) {
      console.error("Error searching for user:", error)

      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء البحث عن المستخدم",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={(e) => handleSearch(e)} className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <User className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="أدخل اسم المستخدم في روبلوكس..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button type="submit" disabled={isSearching} className="gap-2">
              {isSearching ? (
                <>
                  <LoadingSpinner className="h-4 w-4" />
                  جاري البحث...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  بحث
                </>
              )}
            </Button>
          </form>

          {/* عرض سجل البحث */}
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground flex items-center">
                <History className="mr-1 h-4 w-4" />
                عمليات البحث السابقة:
              </p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((name, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      setUsername(name)
                      handleSearch(e, name)
                    }}
                    disabled={isSearching}
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
