/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
