"use client"

import { useState } from "react"
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
import { Logo } from "@/components/logo"
import { Menu, Search, User, Settings, LogOut, Plus, Home, ShoppingBag, Calculator } from "lucide-react"

const navigation = [
  { name: "الرئيسية", href: "/", icon: Home },
  { name: "المنتجات", href: "/assets", icon: ShoppingBag },
]

const tools = [
  { name: "حسابات الضرائب", href: "/calculators", icon: Calculator },
  { name: "معلومات الحساب", href: "/account-info", icon: User },
]

export function Navbar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Logo />

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
                      <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
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
                  <Logo />
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
