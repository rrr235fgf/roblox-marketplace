"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchDialog } from "@/components/search-dialog"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/hooks/use-auth"
import {
  Menu,
  Search,
  User,
  Settings,
  LogOut,
  Plus,
  Home,
  ShoppingBag,
  Calculator,
  MessageCircle,
  Store,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "الرئيسية", href: "/", icon: Home },
  { name: "المنتجات", href: "/assets", icon: ShoppingBag },
]

const tools = [{ name: "حسابات الضرائب", href: "/calculators", icon: Calculator }]

export function Navbar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  // جلب عدد الرسائل غير المقروءة
  useEffect(() => {
    if (user) {
      const fetchUnreadMessages = async () => {
        try {
          const response = await fetch("/api/messages/unread-count")
          if (response.ok) {
            const { count } = await response.json()
            setUnreadMessages(count)
          }
        } catch (error) {
          console.error("Error fetching unread messages:", error)
        }
      }

      fetchUnreadMessages()
      // تحديث كل 30 ثانية
      const interval = setInterval(fetchUnreadMessages, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Logo والنص مع Gradient */}
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              متجر روبلوكس
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}

            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Calculator className="h-4 w-4" />
                  <span>الأدوات</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <DropdownMenuItem key={tool.name} asChild>
                      <Link href={tool.href} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Icon className="h-4 w-4" />
                        <span>{tool.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messages Link - Only show if user is logged in */}
            {user && (
              <Link
                href="/messages"
                className={`flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium transition-colors hover:text-primary relative ${
                  pathname === "/messages" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                <span>الرسائل</span>
                {unreadMessages > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {unreadMessages > 99 ? "99+" : unreadMessages}
                  </Badge>
                )}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(true)} className="hidden sm:flex">
            <Search className="h-4 w-4 ml-2" />
            بحث...
          </Button>

          <ModeToggle />

          {user ? (
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button asChild size="sm" className="hidden sm:flex">
                <Link href="/dashboard/create">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة منتج
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || ""} alt={user.name || ""} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.name && <p className="font-medium">{user.name}</p>}
                      {user.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center space-x-2 rtl:space-x-reverse">
                      <User className="h-4 w-4" />
                      <span>لوحة التحكم</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/messages" className="flex items-center space-x-2 rtl:space-x-reverse relative">
                      <MessageCircle className="h-4 w-4" />
                      <span>الرسائل</span>
                      {unreadMessages > 0 && (
                        <Badge variant="destructive" className="h-4 w-4 rounded-full p-0 text-xs">
                          {unreadMessages > 99 ? "99+" : unreadMessages}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Settings className="h-4 w-4" />
                      <span>الإعدادات</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center space-x-2 rtl:space-x-reverse"
                    onSelect={(event) => {
                      event.preventDefault()
                      signOut()
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button asChild>
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <Store className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    متجر روبلوكس
                  </span>
                </div>

                <div className="flex flex-col space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-md transition-colors hover:bg-accent ${
                          pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}

                  <div className="border-t pt-2">
                    <p className="text-sm font-medium text-muted-foreground px-2 mb-2">الأدوات</p>
                    {tools.map((tool) => {
                      const Icon = tool.icon
                      return (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-md transition-colors hover:bg-accent text-muted-foreground"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{tool.name}</span>
                        </Link>
                      )
                    })}
                  </div>

                  {user && (
                    <div className="border-t pt-2">
                      <Link
                        href="/messages"
                        className={`flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-md transition-colors hover:bg-accent relative ${
                          pathname === "/messages" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>الرسائل</span>
                        {unreadMessages > 0 && (
                          <Badge variant="destructive" className="h-4 w-4 rounded-full p-0 text-xs">
                            {unreadMessages > 99 ? "99+" : unreadMessages}
                          </Badge>
                        )}
                      </Link>
                    </div>
                  )}
                </div>

                {user && (
                  <div className="border-t pt-4">
                    <Button asChild className="w-full mb-2">
                      <Link href="/dashboard/create">
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة منتج
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  )
}
