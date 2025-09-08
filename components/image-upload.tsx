"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImagePlus, X } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  maxImages?: number
}

// دالة لضغط الصورة
const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // حساب الأبعاد الجديدة
      let { width, height } = img

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxWidth) {
          width = (width * maxWidth) / height
          height = maxWidth
        }
      }

      canvas.width = width
      canvas.height = height

      // رسم الصورة
      ctx?.drawImage(img, 0, 0, width, height)

      // تحويل إلى base64
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
      resolve(compressedDataUrl)
    }

    img.onerror = () => reject(new Error("فشل في تحميل الصورة"))
    img.src = URL.createObjectURL(file)
  })
}

export function ImageUpload({ value, onChange, maxImages = 5 }: ImageUploadProps) {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fallbackImage = "/placeholder.svg"

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || files.length === 0) return

    if (value.length + files.length > maxImages) {
      toast({
        title: "تنبيه",
        description: `يمكنك إضافة ${maxImages} صور كحد أقصى`,
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول لتحميل الصور",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    const newImageUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // التحقق من نوع الملف
        if (!file.type.startsWith("image/")) {
          throw new Error("يرجى اختيار ملف صورة صالح")
        }

        // التحقق من حجم الملف (أقل من 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("حجم الصورة كبير جداً (الحد الأقصى 10MB)")
        }

        try {
          // ضغط الصورة
          const compressedImage = await compressImage(file, 800, 0.8)

          // إنشاء FormData مع الصورة المضغوطة
          const formData = new FormData()

          // تحويل base64 إلى blob
          const response = await fetch(compressedImage)
          const blob = await response.blob()

          formData.append("file", blob, `compressed_${file.name}`)

          // رفع الصورة
          const uploadResponse = await fetch("/api/images", {
            method: "POST",
            body: formData,
          })

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json()
            throw new Error(errorData.error || "فشل تحميل الصورة")
          }

          const data = await uploadResponse.json()
          newImageUrls.push(data.url)
        } catch (compressionError) {
          console.error("Compression error:", compressionError)
          // في حالة فشل الضغط، جرب الرفع المباشر
          const formData = new FormData()
          formData.append("file", file)

          const uploadResponse = await fetch("/api/images", {
            method: "POST",
            body: formData,
          })

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json()
            throw new Error(errorData.error || "فشل تحميل الصورة")
          }

          const data = await uploadResponse.json()
          newImageUrls.push(data.url)
        }
      }

      onChange([...value, ...newImageUrls])

      toast({
        title: "تم التحميل بنجاح",
        description: `تم تحميل ${newImageUrls.length} صورة بنجاح`,
      })
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تحميل الصور",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = async (index: number) => {
    const imageUrl = value[index]
    const newImages = [...value]
    newImages.splice(index, 1)
    onChange(newImages)

    // حذف الصورة من الخادم إذا كانت مرفوعة محلياً
    if (imageUrl.startsWith("/api/images/")) {
      const imageId = imageUrl.split("/").pop()
      try {
        await fetch(`/api/images/${imageId}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Error deleting image:", error)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {value.map((image, index) => (
          <div key={index} className="group relative aspect-square overflow-hidden rounded-md border">
            <Image
              src={image || fallbackImage}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = fallbackImage
              }}
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {value.length < maxImages && (
          <div className="relative aspect-square rounded-md border border-dashed">
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click()
                }
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
                {isUploading ? (
                  <>
                    <LoadingSpinner className="h-8 w-8" />
                    <p className="text-xs text-muted-foreground">جاري التحميل...</p>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">اضغط لإضافة صور</p>
                    <p className="text-xs text-muted-foreground opacity-75">الحد الأقصى 10MB</p>
                  </>
                )}
              </div>
            </div>
            <Input
              ref={fileInputRef}
              id="image-upload-input"
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </div>
        )}
      </div>

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length} من {maxImages} صور
        </p>
      )}
    </div>
  )
}
