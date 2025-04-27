"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    id: 1,
    content: "افضل منصة عربية للتطوير ربحت منها واجد",
    author: {
      name: "! 𝑇𝑟𝑢𝑛𝑘𝑠💥",
      role: "مطور ألعاب",
      avatar: "https://cdn.discordapp.com/avatars/1177854184855453736/1060f49b9320ddbbde8a3540207e2b56.webp?size=80",
    },
  },
  {
    id: 2,
    content: "البيع سهل بشكل مو طبيعي بعت 4 مابات من اول يوم شكرا لكم",
    author: {
      name: "7hoda",
      role: "مصمم ألعاب",
      avatar: "https://cdn.discordapp.com/avatars/941350119125696583/16d1ea3df54d25cf584b11747a92887d.webp?size=80",
    },
  },
  {
    id: 3,
    content: "الدعم الفني بالدسكورد يرد بسرعة واي مشكلة تواجهك يحلوها لك اشكرهم🤍",
    author: {
      name: "الـشـيـخ الـزهـرانـي ⁷⁰²",
      role: "مطور محتوى",
      avatar: "https://cdn.discordapp.com/avatars/288306026078535681/5b02c35bac8dae5947501f63e27ecee5.webp?size=80",
    },
  },
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">ماذا يقول عملاؤنا</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">آراء المستخدمين الذين استفادوا من منصتنا</p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute -left-4 top-1/2 z-10 flex -translate-y-1/2 md:-left-6">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-background shadow-md"
              onClick={prevTestimonial}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">السابق</span>
            </Button>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="w-full flex-shrink-0 bg-background">
                  <CardContent className="p-8">
                    <Quote className="mb-4 h-10 w-10 text-primary/20" />
                    <p className="mb-6 text-lg">{testimonial.content}</p>
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src={testimonial.author.avatar || "/placeholder.svg"}
                          alt={testimonial.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.author.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.author.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="absolute -right-4 top-1/2 z-10 flex -translate-y-1/2 md:-right-6">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-background shadow-md"
              onClick={nextTestimonial}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">التالي</span>
            </Button>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === activeIndex ? "w-6 bg-primary" : "bg-primary/30"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
