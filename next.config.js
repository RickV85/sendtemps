/** @type {import('next').NextConfig} */

// const isDev = process.env.NODE_ENV === "development";

// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   // Disables in development
//   disable: isDev,
//   exclude: [
//     // add buildExcludes here
//     ({ asset, compilation }) => {
//       if (
//         asset.name.startsWith("server/") ||
//         asset.name.match(
//           /^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/
//         )
//       ) {
//         return true;
//       }
//       if (isDev && !asset.name.startsWith("static/runtime/")) {
//         return true;
//       }
//       return false;
//     },
//   ],
// });

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
