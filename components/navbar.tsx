"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchDialog } from "@/components/search-dialog"
import { TermsDialog } from "@/components/terms-dialog"
import { DiscordLogo } from "@/components/discord-logo"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronDown, User, LogOut, Settings, Package, Gift } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-all",
        isScrolled ? "border-border shadow-sm" : "border-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <span className="text-xl font-bold">Roblox Marketplace</span>
          </Link>

          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground",
              )}
            >
              الرئيسية
            </Link>
            <Link
              href="/assets"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/assets" || pathname.startsWith("/assets/") ? "text-primary" : "text-muted-foreground",
              )}
            >
              المنتجات
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className={cn(
                    "group flex items-center gap-1 px-0 text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/account-info" || pathname === "/calculators" || pathname === "/lucky-wheel"
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  الأدوات
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/account-info">معلومات الحساب</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/calculators">حسابات الضرائب</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/lucky-wheel">عجلة الحظ</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <SearchDialog />
          <ModeToggle />
          <TermsDialog />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <img
                    src={user.avatar || "/placeholder.svg?height=32&width=32"}
                    alt={user.username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>لوحة التحكم</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>الإعدادات</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/my-assets" className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    <span>منتجاتي</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/lucky-wheel" className="cursor-pointer">
                    <Gift className="mr-2 h-4 w-4" />
                    <span>عجلة الحظ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login" className="flex items-center gap-2">
                <DiscordLogo className="h-4 w-4" />
                <span>تسجيل الدخول</span>
              </Link>
            </Button>
          )}

          <button
            className="block rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="container pb-3 md:hidden">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                pathname === "/" ? "bg-accent text-foreground" : "text-muted-foreground",
              )}
            >
              الرئيسية
            </Link>
            <Link
              href="/assets"
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                pathname === "/assets" || pathname.startsWith("/assets/")
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground",
              )}
            >
              المنتجات
            </Link>
            <Link
              href="/account-info"
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                pathname === "/account-info" ? "bg-accent text-foreground" : "text-muted-foreground",
              )}
            >
              معلومات الحساب
            </Link>
            <Link
              href="/calculators"
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                pathname === "/calculators" ? "bg-accent text-foreground" : "text-muted-foreground",
              )}
            >
              حسابات الضرائب
            </Link>
            <Link
              href="/lucky-wheel"
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                pathname === "/lucky-wheel" ? "bg-accent text-foreground" : "text-muted-foreground",
              )}
            >
              عجلة الحظ
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
