"use client"

import { motion } from "framer-motion"
import { Search, ShoppingCart, MessageCircle, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "ابحث عن المنتج",
    description: "تصفح مجموعة واسعة من منتجات Roblox المتاحة في السوق",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: ShoppingCart,
    title: "اختر ما يناسبك",
    description: "اختر المنتج الذي يلبي احتياجاتك من بين مجموعة متنوعة",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: MessageCircle,
    title: "تواصل مع البائع",
    description: "تواصل مباشرة مع البائع عبر Discord لمناقشة التفاصيل",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: CheckCircle,
    title: "أتمم الصفقة",
    description: "أكمل عملية الشراء واحصل على المنتج بسرعة وأمان",
    color: "bg-orange-500/10 text-orange-500",
  },
]

export function HowItWorks() {
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
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">كيف يعمل السوق</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            عملية بسيطة وسريعة للحصول على أصول Roblox التي تحتاجها
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-x-1/2 bg-border lg:block" />
              )}

              <div className="flex flex-col items-center text-center">
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${step.color}`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
