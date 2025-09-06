import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">RM</span>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Roblox Market
        </span>
      </div>
    </Link>
  )
}
