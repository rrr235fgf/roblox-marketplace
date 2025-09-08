import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "متجر روبلوكس - أفضل منصة لبيع وشراء منتجات روبلوكس",
  description: "اكتشف أفضل منتجات روبلوكس من حسابات وأصول وأدوات. منصة آمنة وموثوقة للتجارة في عالم روبلوكس",
  keywords: "روبلوكس, حسابات روبلوكس, أصول روبلوكس, متجر روبلوكس, robux",
  authors: [{ name: "متجر روبلوكس" }],
  creator: "متجر روبلوكس",
  publisher: "متجر روبلوكس",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.jpg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://roblox-marketplace.vercel.app",
    title: "متجر روبلوكس - أفضل منصة لبيع وشراء منتجات روبلوكس",
    description: "اكتشف أفضل منتجات روبلوكس من حسابات وأصول وأدوات. منصة آمنة وموثوقة للتجارة في عالم روبلوكس",
    siteName: "متجر روبلوكس",
  },
  twitter: {
    card: "summary_large_image",
    title: "متجر روبلوكس - أفضل منصة لبيع وشراء منتجات روبلوكس",
    description: "اكتشف أفضل منتجات روبلوكس من حسابات وأصول وأدوات. منصة آمنة وموثوقة للتجارة في عالم روبلوكس",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
