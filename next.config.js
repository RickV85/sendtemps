/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')

const nextConfig = {
  ...withPWA({
    dest: 'public',
    register: 'true',
    skipWaiting: 'true',
  }),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
