import Image from "next/image"

export function RobuxIcon({ className }: { className?: string }) {
  return (
    <div className={`relative ${className || "h-6 w-6"}`}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-s6fSkoh9jsbmSTLyq9HjIrxDiJaONH.png"
        alt="روبوكس"
        fill
        className="object-contain"
      />
    </div>
  )
}

export function RiyalIcon({ className }: { className?: string }) {
  return (
    <div className={`relative ${className || "h-6 w-6"}`}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PayEkaXy9uTEmfW2BtJr9HPikjM5IJ.png"
        alt="ريال"
        fill
        className="object-contain"
      />
    </div>
  )
}

export function CreditIcon({ className }: { className?: string }) {
  return (
    <div className={`relative ${className || "h-6 w-6"}`}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/probot%20%281%29-FPAPUIycIdT2kBRo53kF6a5IkJ17ot.png"
        alt="كريديت"
        fill
        className="object-contain"
      />
    </div>
  )
}
