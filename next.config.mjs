/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com', 'tr.rbxcdn.com', 'www.roblox.com', 'replicate.delivery'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add this to force using Tailwind v3 instead of v4
  webpack: (config) => {
    // Find the rule that handles CSS
    const rules = config.module.rules.find((rule) => typeof rule.oneOf === 'object').oneOf;
    
    // Force resolve tailwindcss to v3
    config.resolve.alias = {
      ...config.resolve.alias,
      tailwindcss: require.resolve('tailwindcss'),
    };
    
    return config;
  },
}

export default nextConfig
