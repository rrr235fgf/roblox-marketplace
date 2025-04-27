"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { DashboardNav } from "@/components/dashboard-nav"
import { ImageUpload } from "@/components/image-upload"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/loading-spinner"
import { createAsset } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RobuxIcon, RiyalIcon, CreditIcon } from "@/components/payment-icons"

const formSchema = z.object({
  title: z.string().min(3, { message: "يجب أن يكون العنوان 3 أحرف على الأقل" }),
  description: z.string().min(10, { message: "يجب أن يكون الوصف 10 أحرف على الأقل" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "يجب أن يكون السعر رقمًا موجبًا",
  }),
  category: z.enum(["mm2", "bloxfruit", "timewar", "robux", "accounts", "development", "other"]),
  paymentMethod: z.enum(["robux", "riyal", "credit"], {
    required_error: "يرجى اختيار طريقة الدفع",
  }),
  images: z.array(z.string()).min(1, { message: "يجب إضافة صورة واحدة على الأقل" }),
})

export default function CreateAsset() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "mm2",
      paymentMethod: "robux",
      images: [],
    },
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)

      // إضافة معالجة أخطاء أفضل
      if (!user || !user.id) {
        toast({
          title: "خطأ في المصادقة",
          description: "يرجى تسجيل الدخول مرة أخرى",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      // التأكد من وجود صور
      if (values.images.length === 0) {
        toast({
          title: "خطأ في الصور",
          description: "يرجى إضافة صورة واحدة على الأقل",
          variant: "destructive",
        })
        return
      }

      // محاولة إنشاء المنتج
      await createAsset({
        ...values,
        price: Number(values.price),
        sellerId: user.id,
      })

      // إظهار رسالة نجاح
      toast({
        title: "تم إنشاء المنتج بنجاح",
        description: "تم نشر المنتج الخاص بك في السوق",
      })

      // الانتقال إلى لوحة التحكم
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating asset:", error)

      // إظهار رسالة خطأ
      toast({
        title: "خطأ في إنشاء المنتج",
        description: "حدث خطأ أثناء محاولة إنشاء المنتج. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <main>
          <Card>
            <CardHeader>
              <CardTitle>إضافة منتج جديد</CardTitle>
              <CardDescription>قم بإضافة منتج جديد للبيع في السوق</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان المنتج</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان المنتج" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف المنتج</FormLabel>
                        <FormControl>
                          <Textarea placeholder="أدخل وصفًا تفصيليًا للمنتج" className="min-h-32" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>السعر</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الفئة</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر فئة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mm2">ام ام تو</SelectItem>
                              <SelectItem value="bloxfruit">بلوكس فروت</SelectItem>
                              <SelectItem value="timewar">حرب الوقت</SelectItem>
                              <SelectItem value="robux">روبوكس</SelectItem>
                              <SelectItem value="accounts">حسابات</SelectItem>
                              <SelectItem value="development">تطوير</SelectItem>
                              <SelectItem value="other">اشياء اخرى</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>طريقة الدفع</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-x-reverse">
                              <FormControl>
                                <RadioGroupItem value="robux" id="robux" />
                              </FormControl>
                              <FormLabel className="flex items-center gap-2 font-normal cursor-pointer" htmlFor="robux">
                                <RobuxIcon className="h-5 w-5" />
                                <span>روبوكس</span>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-x-reverse">
                              <FormControl>
                                <RadioGroupItem value="riyal" id="riyal" />
                              </FormControl>
                              <FormLabel className="flex items-center gap-2 font-normal cursor-pointer" htmlFor="riyal">
                                <RiyalIcon className="h-5 w-5" />
                                <span>ريال سعودي</span>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-x-reverse">
                              <FormControl>
                                <RadioGroupItem value="credit" id="credit" />
                              </FormControl>
                              <FormLabel
                                className="flex items-center gap-2 font-normal cursor-pointer"
                                htmlFor="credit"
                              >
                                <CreditIcon className="h-5 w-5" />
                                <span>كريديت</span>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>صور المنتج</FormLabel>
                        <FormControl>
                          <ImageUpload value={field.value} onChange={field.onChange} maxImages={5} />
                        </FormControl>
                        <FormDescription>
                          يمكنك إضافة حتى 5 صور للمنتج. الصورة الأولى ستكون الصورة الرئيسية.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner className="mr-2" />
                        جاري النشر...
                      </>
                    ) : (
                      "نشر المنتج"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
