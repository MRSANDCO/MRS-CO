import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   turbopack: {
//     root: '.', // Specify current directory as root
//   },
// };

// module.exports = nextConfig;

// export default nextConfig;
