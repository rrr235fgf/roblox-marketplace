"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchDialog } from "@/components/search-dialog"
import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "@/components/logo"
import { useAuth } from "@/hooks/use-auth"
import { Search, User, LogOut, Settings, Home, Package, Calculator, MessageCircle } from "lucide-react"

export function Navbar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // جلب عدد الرسائل غير المقروءة
  useEffect(() => {
    if (user) {
      const fetchUnreadCount = async () => {
        try {
          const response = await fetch("/api/messages/unread-count")
          if (response.ok) {
            const data = await response.json()
            setUnreadCount(data.count)
          }
        } catch (error) {
          console.error("Error fetching unread count:", error)
        }
      }

      fetchUnreadCount()

      // تحديث العدد كل 30 ثانية
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button variant={isActive("/") ? "default" : "ghost"} size="sm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                الرئيسية
              </Button>
            </Link>

            <Link href="/assets">
              <Button variant={isActive("/assets") ? "default" : "ghost"} size="sm" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                المنتجات
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isActive("/calculators") ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  الأدوات
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/calculators">حسابات الضرائب</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)} className="hidden md:flex">
            <Search className="h-4 w-4 mr-2" />
            بحث...
          </Button>

          <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)} className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>

          <ModeToggle />

          {user ? (
            <div className="flex items-center gap-2">
              {/* زر الرسائل */}
              <Link href="/messages">
                <Button variant={isActive("/messages") ? "default" : "ghost"} size="sm" className="relative">
                  <MessageCircle className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">لوحة التحكم</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.id}`}>الملف الشخصي</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      الإعدادات
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">تسجيل الدخول</Button>
            </Link>
          )}
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  )
}
