/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    dirs: ['cypress', 'src'],
  },
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
};

module.exports = nextConfig;
