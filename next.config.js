/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'spoonacular.com' },
      { protocol: 'https', hostname: 'img.spoonacular.com' },
    ],
  },
}

module.exports = nextConfig
