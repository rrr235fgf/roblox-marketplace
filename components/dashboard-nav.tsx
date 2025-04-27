"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, User, PlusCircle, LayoutDashboard, ShoppingBag } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const items = [
    {
      title: "لوحة التحكم",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "منتجاتي",
      href: "/dashboard/my-assets",
      icon: ShoppingBag,
    },
    {
      title: "إضافة منتج",
      href: "/dashboard/create",
      icon: PlusCircle,
    },
    {
      title: "الملف الشخصي",
      href: user ? `/profile/${user.id}` : "/profile",
      icon: User,
    },
    {
      title: "الإعدادات",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="flex w-full flex-col gap-2 p-1">
        {items.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="justify-start"
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
