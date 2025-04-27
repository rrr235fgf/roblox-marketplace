"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Download, Loader2, User, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function RobloxAvatarGenerator() {
  const [username, setUsername] = useState("")
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateAvatar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المستخدم",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setGeneratedSvg(null)

    try {
      const response = await fetch("/api/generate-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "فشل في إنشاء الصورة")
      }

      setGeneratedSvg(data.svg)

      toast({
        title: "تم إنشاء الصورة بنجاح!",
        description: "يمكنك الآن تحميل الصورة",
      })
    } catch (err) {
      toast({
        title: "حدث خطأ",
        description: err instanceof Error ? err.message : "فشل في إنشاء الصورة",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = () => {
    if (!generatedSvg) return

    // Create a Blob from the SVG string
    const blob = new Blob([generatedSvg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.download = `${username}-avatar.svg`
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL
    URL.revokeObjectURL(url)

    toast({
      title: "تم تحميل الصورة",
      description: "تم حفظ الصورة بنجاح",
    })
  }

  const regenerateAvatar = () => {
    if (loading) return
    generateAvatar({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden shadow-lg border-primary/20">
        <CardContent className="p-6">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 mb-6">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-60"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">إنشاء صورة الشخصية</h2>
                <p className="text-sm text-muted-foreground">
                  أدخل اسم المستخدم الخاص بك في روبلوكس لإنشاء صورة شخصية مخصصة
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <form onSubmit={generateAvatar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-lg">
                    اسم المستخدم
                  </Label>
                  <Input
                    id="username"
                    placeholder="أدخل اسم المستخدم في روبلوكس"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="text-lg"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !username}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    "إنشاء الصورة"
                  )}
                </Button>
              </form>

              {generatedSvg && (
                <div className="flex gap-2">
                  <Button onClick={downloadImage} className="flex-1 bg-green-600 hover:bg-green-500">
                    <Download className="mr-2 h-4 w-4" />
                    تحميل الصورة
                  </Button>

                  <Button onClick={regenerateAvatar} variant="outline" disabled={loading} className="flex-1">
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    إعادة الإنشاء
                  </Button>
                </div>
              )}

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">
                  <span className="font-medium">كيفية الاستخدام:</span> أدخل اسم المستخدم الخاص بك في روبلوكس وانقر على
                  زر "إنشاء الصورة". سيتم إنشاء صورة مخصصة لشخصيتك يمكنك تحميلها واستخدامها.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <motion.div
                className="relative w-64 h-64 rounded-xl overflow-hidden border-2 border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {loading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/30">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Loader2 className="h-12 w-12 text-blue-400 mb-4" />
                    </motion.div>
                    <p className="text-gray-200 text-center">جاري إنشاء الصورة...</p>
                  </div>
                ) : generatedSvg ? (
                  <div
                    className="w-full h-full bg-white flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: generatedSvg }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-blue-900/30 to-purple-900/30">
                    <motion.div
                      className="opacity-50"
                      animate={{
                        y: [0, -5, 0],
                        opacity: [0.5, 0.7, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    >
                      <User className="h-16 w-16 text-blue-300" />
                    </motion.div>
                    <p className="mt-4 text-center text-sm text-gray-300">صورة شخصيتك ستظهر هنا</p>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p className="text-sm text-muted-foreground">
                  {generatedSvg ? `صورة شخصية ${username}` : "أدخل اسم المستخدم وانقر على زر الإنشاء"}
                </p>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
