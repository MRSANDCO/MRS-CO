// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = nextConfig
import type { NextConfig } from 'next'
import path from 'path/win32'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
//  output: {
//     // This is the correct property name
//     fileTracingRoot: require('path').join(__dirname)
//   }
}

export default nextConfig
