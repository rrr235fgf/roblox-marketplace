/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.discordapp.com', 
      'i.ibb.co', 
      'placeholder.pics', 
      'via.placeholder.com',
      'placehold.co',
      'placekitten.com',
      'picsum.photos',
      'tr.rbxcdn.com', 
      'www.roblox.com', 
      'replicate.delivery'
    ],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // استخدام حل بسيط لتجنب مشكلة Tailwind CSS
  experimental: {
    // تعطيل بعض الميزات التجريبية التي قد تسبب مشاكل
    esmExternals: 'loose',
  },
}

export default nextConfig
