/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add this to handle any potential image domains
  images: {
    domains: [],
  },
}

module.exports = nextConfig 