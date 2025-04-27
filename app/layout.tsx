import type React from "react"
import { Tajawal } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/app/providers"
import "./globals.css"

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
})

export const metadata: Metadata = {
  title: "متجر روبلوكس",
  description: "موقع بيع كل مايخص روبلوكس (التسجيل عبر الدسكورد)",
  icons: {
    icon: [
      {
        url: "https://i.ibb.co/jPM95k76/image.png",
        href: "https://i.ibb.co/jPM95k76/image.png",
      },
    ],
  },
  openGraph: {
    title: "متجر روبلوكس",
    description: "موقع بيع كل مايخص روبلوكس (التسجيل عبر الدسكورد)",
    images: [
      {
        url: "https://i.ibb.co/LdnzykHc/image-39.png", // Usando la imagen de la página principal
        width: 1200,
        height: 630,
        alt: "متجر روبلوكس",
      },
    ],
    type: "website",
    siteName: "متجر روبلوكس",
  },
  twitter: {
    card: "summary_large_image",
    title: "متجر روبلوكس",
    description: "موقع بيع كل مايخص روبلوكس (التسجيل عبر الدسكورد)",
    images: ["https://i.ibb.co/LdnzykHc/image-39.png"], // Usando la imagen de la página principal
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="https://i.ibb.co/jPM95k76/image.png" />
      </head>
      <body className={`${tajawal.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
