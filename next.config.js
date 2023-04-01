/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production' // 프로덕션 모드인지

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  assetPrefix: isProd ? process.env.NEXTAUTH_URL : '',
}

module.exports = nextConfig