"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AssetGrid } from "@/components/asset-grid"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function AssetsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState(categoryParam || "all")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (categoryParam) {
      setActiveTab(categoryParam)
    }
  }, [categoryParam])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container flex-1 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">استعراض المنتجات</h1>
          <p className="text-muted-foreground">تصفح جميع المنتجات المتاحة في متجر روبلوكس</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن المنتجات..."
            className="pr-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start flex-wrap">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="mm2">ام ام تو</TabsTrigger>
            <TabsTrigger value="bloxfruit">بلوكس فروت</TabsTrigger>
            <TabsTrigger value="timewar">حرب الوقت</TabsTrigger>
            <TabsTrigger value="robux">روبوكس</TabsTrigger>
            <TabsTrigger value="accounts">حسابات</TabsTrigger>
            <TabsTrigger value="development">تطوير</TabsTrigger>
            <TabsTrigger value="other">اشياء اخرى</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <AssetGrid searchQuery={searchQuery} />
            )}
          </TabsContent>
          <TabsContent value="mm2">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <AssetGrid category="mm2" searchQuery={searchQuery} />
            )}
          </TabsContent>
          <TabsContent value="bloxfruit">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <AssetGrid category="bloxfruit" searchQuery={searchQuery} />
            )}
          </TabsContent>
          <TabsContent value="timewar">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <AssetGrid category="timewar" searchQuery={searchQuery} />
            )}
          </TabsContent>
          <TabsContent value="robux">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <AssetGrid category="robux" searchQuery={searchQuery} />
            )}
          </TabsContent>
          <TabsContent value="accounts">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <AssetGrid category="accounts" searchQuery={searchQuery} />
            )}
          </TabsContent>
          <TabsContent value="development">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <AssetGrid category="development" searchQuery={searchQuery} />
            )}
          </TabsContent>
          <TabsContent value="other">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <AssetGrid category="other" searchQuery={searchQuery} />
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
