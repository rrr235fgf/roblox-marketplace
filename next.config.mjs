/** @type {import('next').NextConfig} */
const nextConfig = {
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
  }
}

export default nextConfig
