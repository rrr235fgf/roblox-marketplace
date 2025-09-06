import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
  }).format(price)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj)
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "منذ لحظات"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `منذ ${minutes} دقيقة`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `منذ ${hours} ساعة`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `منذ ${days} يوم`
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function containsInappropriateContent(text: string): boolean {
  const inappropriateWords = [
    "كلمات غير مناسبة",
    "محتوى مسيء",
    "spam",
    "scam",
    // يمكنك إضافة المزيد من الكلمات المحظورة هنا
  ]

  const lowerText = text.toLowerCase()
  return inappropriateWords.some((word) => lowerText.includes(word.toLowerCase()))
}

export function sanitizeText(text: string): string {
  // إزالة HTML tags
  const withoutHtml = text.replace(/<[^>]*>/g, "")

  // إزالة الأحرف الخاصة الضارة
  const sanitized = withoutHtml.replace(/[<>"'&]/g, "")

  // تنظيف المسافات الزائدة
  const cleaned = sanitized.replace(/\s+/g, " ").trim()

  return cleaned
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function isValidImageType(type: string): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  return validTypes.includes(type)
}

export function calculateTax(
  price: number,
  taxRate = 0.3,
): {
  originalPrice: number
  tax: number
  finalPrice: number
} {
  const tax = price * taxRate
  const finalPrice = price - tax

  return {
    originalPrice: price,
    tax,
    finalPrice,
  }
}

export function calculateDevExRate(
  robux: number,
  rate = 0.0035,
): {
  robux: number
  usd: number
  rate: number
} {
  const usd = robux * rate

  return {
    robux,
    usd,
    rate,
  }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
