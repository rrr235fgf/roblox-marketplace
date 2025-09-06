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

  // Remove inappropriate content
  inappropriateWords.forEach((word) => {
    const regex = new RegExp(word, "gi")
    sanitized = sanitized.replace(regex, "***")
  })

  return sanitized
}

// Format currency
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

// Format date
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
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

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
