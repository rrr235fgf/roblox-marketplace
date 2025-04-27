import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// قائمة بالكلمات غير اللائقة (يمكن توسيعها حسب الحاجة)
const inappropriateWords = [
  // كلمات عربية غير لائقة
  "كلمة1",
  "كلمة2",
  "كلمة3",
  // كلمات إنجليزية غير لائقة
  "word1",
  "word2",
  "word3",
]

// دالة للتحقق من وجود كلمات غير لائقة في النص
export function containsInappropriateContent(text: string): boolean {
  if (!text) return false

  const lowerText = text.toLowerCase()

  return inappropriateWords.some((word) => lowerText.includes(word.toLowerCase()))
}

// دالة لتنقية النص من الكلمات غير اللائقة
export function sanitizeText(text: string): string {
  if (!text) return text

  let sanitizedText = text

  inappropriateWords.forEach((word) => {
    const regex = new RegExp(word, "gi")
    sanitizedText = sanitizedText.replace(regex, "***")
  })

  return sanitizedText
}
