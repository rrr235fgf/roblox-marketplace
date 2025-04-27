"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { AssetGrid } from "@/components/asset-grid"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] py-8">
        <DashboardNav />
        <main className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
            <Button onClick={() => router.push("/dashboard/create")}>
              <Plus className="mr-2 h-4 w-4" /> إضافة منتج جديد
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن المنتجات..."
              className="pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="mm2">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-7">
              <TabsTrigger value="mm2">ام ام تو</TabsTrigger>
              <TabsTrigger value="bloxfruit">بلوكس فروت</TabsTrigger>
              <TabsTrigger value="timewar">حرب الوقت</TabsTrigger>
              <TabsTrigger value="robux">روبوكس</TabsTrigger>
              <TabsTrigger value="accounts">حسابات</TabsTrigger>
              <TabsTrigger value="development">تطوير</TabsTrigger>
              <TabsTrigger value="other">اخرى</TabsTrigger>
            </TabsList>
            <TabsContent value="mm2">
              <AssetGrid category="mm2" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="bloxfruit">
              <AssetGrid category="bloxfruit" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="timewar">
              <AssetGrid category="timewar" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="robux">
              <AssetGrid category="robux" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="accounts">
              <AssetGrid category="accounts" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="development">
              <AssetGrid category="development" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="other">
              <AssetGrid category="other" searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
