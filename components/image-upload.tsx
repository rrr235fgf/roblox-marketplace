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

export function ImageUpload({ value, onChange, maxImages = 5 }: ImageUploadProps) {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // الصور الثابتة البديلة في حالة فشل التحميل
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
        const fileId = `upload-${Date.now()}-${i}`

        // إنشاء FormData لتحميل الصورة
        const formData = new FormData()
        formData.append("file", file)

        // تحميل الصورة إلى الخادم
        const response = await fetch("/api/images", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "فشل تحميل الصورة")
        }

        const data = await response.json()
        newImageUrls.push(data.url)
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
      setUploadProgress({})
      // إعادة تعيين حقل الإدخال
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

    // إذا كانت الصورة مخزنة في قاعدة البيانات، قم بحذفها
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
                // إذا فشل تحميل الصورة، استخدم صورة بديلة
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
