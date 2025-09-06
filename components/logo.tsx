export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* خلفية دائرية */}
        <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />

        {/* رمز السوق */}
        <path d="M12 16h16l-1.5 8H13.5L12 16z" fill="white" fillOpacity="0.9" />
        <path
          d="M12 16l-1-4h18l-1 4"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* نقاط تزيينية */}
        <circle cx="16" cy="20" r="1" fill="white" fillOpacity="0.7" />
        <circle cx="20" cy="20" r="1" fill="white" fillOpacity="0.7" />
        <circle cx="24" cy="20" r="1" fill="white" fillOpacity="0.7" />
      </svg>
    </div>
  )
}
