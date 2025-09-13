/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 确保静态导出时路径正确
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : ''
}

module.exports = nextConfig
