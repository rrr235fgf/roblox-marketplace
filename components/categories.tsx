"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"

const categories = [
  {
    title: "ام ام تو",
    description: "منتجات خاصة بلعبة ام ام تو",
    image: "/placeholder.svg?height=80&width=80&text=MM2",
    href: "/assets?category=mm2",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "بلوكس فروت",
    description: "منتجات خاصة بلعبة بلوكس فروت",
    image: "/placeholder.svg?height=80&width=80&text=Blox+Fruit",
    href: "/assets?category=bloxfruit",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    title: "ماب المزرعة",
    description: "منتجات خاصة بلعبة ماب المزرعة",
    image: "/placeholder.svg?height=80&width=80&text=Farm+Map",
    href: "/assets?category=farmmap",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  {
    title: "اسرق الشخصيات",
    description: "منتجات خاصة بلعبة اسرق الشخصيات",
    image: "/placeholder.svg?height=80&width=80&text=Steal+Characters",
    href: "/assets?category=stealcharacters",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    title: "روبوكس",
    description: "روبوكس بأسعار مناسبة",
    image: "/placeholder.svg?height=80&width=80&text=Robux",
    href: "/assets?category=robux",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    title: "حسابات",
    description: "حسابات روبلوكس متنوعة",
    image: "/placeholder.svg?height=80&width=80&text=Accounts",
    href: "/assets?category=accounts",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "اشياء اخرى",
    description: "منتجات متنوعة أخرى",
    image: "/placeholder.svg?height=80&width=80&text=Other",
    href: "/assets?category=other",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
]

export function Categories() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">تصفح حسب الفئة</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            اكتشف مجموعة متنوعة من المنتجات المصنفة حسب النوع لتجد بالضبط ما تبحث عنه
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full mx-auto ${category.color}`}
                  >
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-center">{category.title}</h3>
                  <p className="text-muted-foreground text-center">{category.description}</p>
                </CardContent>
                <CardFooter className="border-t bg-muted/30 px-6 py-4">
                  <Button asChild variant="ghost" className="w-full justify-between group-hover:text-primary">
                    <Link href={category.href}>
                      <span>استعراض</span>
                      <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[-4px]" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
