import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative h-8 w-8 overflow-hidden rounded-full">
        <Image src="https://i.ibb.co/jPM95k76/image.png" alt="Logo" fill className="object-cover" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        متجر روبلوكس
      </span>
    </Link>
  )
}
