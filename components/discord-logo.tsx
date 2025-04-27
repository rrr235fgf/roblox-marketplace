import type { SVGProps } from "react"

export function DiscordLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <path d="M7.5 7.2A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 4.5 1.2 10 10 0 0 1 .5 8.05 5.8 5.8 0 0 1-2.7 2.4 5.8 5.8 0 0 1-4.6 0 5.8 5.8 0 0 1-2.7-2.4 10 10 0 0 1 .5-8.05" />
      <path d="M4.9 15A17 17 0 0 0 7 19a1 1 0 0 0 1.7 0 17 17 0 0 0 2.3-4" />
      <path d="M19.1 15a17 17 0 0 1-2.1 4 1 1 0 0 1-1.7 0 17 17 0 0 1-2.3-4" />
    </svg>
  )
}
