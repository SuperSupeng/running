/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 禁用服务端功能
  experimental: {
    esmExternals: false
  },
  // 确保静态导出时路径正确
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // 生成静态文件
  generateStaticParams: true
}

module.exports = nextConfig
