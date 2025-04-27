import type React from "react"
import type { Metadata } from "next"

type Props = {
  params: { id: string }
}

export const metadata: Metadata = {
  title: "تفاصيل المنتج | سوق روبلوكس",
  description: "عرض تفاصيل المنتج في سوق روبلوكس",
}

export default function AssetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
