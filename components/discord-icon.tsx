import type { LightbulbIcon as LucideProps } from "lucide-react"

export function DiscordIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 9a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5a5 5 0 0 0 5 5h4" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="12" r="1" />
      <path d="M9 16s1 1 3 1 3-1 3-1" />
      <path d="M19 16v3a2 2 0 0 1-2 2h-1.5" />
      <path d="M19 22v-6" />
      <path d="M22 19h-6" />
    </svg>
  )
}
