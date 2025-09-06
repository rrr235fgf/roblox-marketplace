import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Content moderation functions
const inappropriateWords = [
  // Add inappropriate words here
  "spam",
  "scam",
  "hack",
  "cheat",
  "exploit",
  "bot",
  "fake",
  "virus",
  "malware",
  // Arabic inappropriate words
  "احتيال",
  "خداع",
  "نصب",
  "هاك",
  "غش",
  "فيروس",
  "برمجيات خبيثة",
  "سيء",
  "قبيح",
  "مكروه",
  "bad",
  "ugly",
  "hate",
]

export function containsInappropriateContent(text: string): boolean {
  if (!text || typeof text !== "string") return false

  const lowerText = text.toLowerCase()
  return inappropriateWords.some((word) => lowerText.includes(word.toLowerCase()))
}

export function sanitizeText(text: string): string {
  if (!text || typeof text !== "string") return ""

  // Remove HTML tags
  let sanitized = text.replace(/<[^>]*>/g, "")

  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, " ").trim()

  // Remove special characters that could be used for XSS
  sanitized = sanitized.replace(/[<>'"&]/g, "")

  return sanitized
}

// Format currency
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
  }).format(price)
}

// Format date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

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

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + "..."
}

// Slugify text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Validate input
export function validateInput(
  input: string,
  maxLength = 1000,
): {
  isValid: boolean
  error?: string
} {
  if (!input || input.trim().length === 0) {
    return { isValid: false, error: "النص مطلوب" }
  }

  if (input.length > maxLength) {
    return { isValid: false, error: `النص طويل جداً (الحد الأقصى ${maxLength} حرف)` }
  }

  if (containsInappropriateContent(input)) {
    return { isValid: false, error: "النص يحتوي على محتوى غير مناسب" }
  }

  return { isValid: true }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 بايت"

  const k = 1024
  const sizes = ["بايت", "كيلوبايت", "ميجابايت", "جيجابايت"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
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
