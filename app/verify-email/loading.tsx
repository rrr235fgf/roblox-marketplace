import { LoadingSpinner } from "@/components/loading-spinner"
import { Navbar } from "@/components/navbar"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحقق من البريد الإلكتروني...</p>
        </div>
      </main>
    </div>
  )
}
