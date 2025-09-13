# 跑步打卡应用部署指南

## 🚀 部署方案

### 方案一：Vercel 部署（推荐）

#### 1. 准备工作
- 确保代码已提交到 Git 仓库（GitHub/GitLab）
- 注册 Vercel 账号：https://vercel.com

#### 2. 部署步骤

**方法A：通过 Vercel 网站**
1. 登录 Vercel 控制台
2. 点击 "New Project"
3. 导入您的 Git 仓库
4. 选择 `frontend` 文件夹作为根目录
5. 框架选择 "Next.js"
6. 点击 "Deploy" 开始部署

**方法B：通过 Vercel CLI**
```bash
# 安装 Vercel CLI
npm i -g vercel

# 在 frontend 目录下登录
cd frontend
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

#### 3. 环境变量配置
在 Vercel 项目设置中添加环境变量：
- `NODE_ENV=production`

### 方案二：Netlify 部署

#### 1. 构建静态文件
```bash
cd frontend
npm run build
```

#### 2. 部署到 Netlify
1. 访问 https://netlify.com
2. 注册/登录账号
3. 拖拽 `frontend/out` 文件夹到部署区域
4. 或连接 Git 仓库自动部署

### 方案三：GitHub Pages 部署

#### 1. 配置 GitHub Actions
创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm install
          
      - name: Build
        run: |
          cd frontend
          npm run build
          
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/out
```

## 🔧 部署前检查

### 1. 测试本地构建
```bash
cd frontend
npm run build
npm run start
```

### 2. 检查功能
- [ ] 用户登录功能
- [ ] 跑步记录添加/编辑/删除
- [ ] 目标设定功能
- [ ] 排行榜显示
- [ ] 响应式设计

### 3. 性能优化
- [ ] 图片优化
- [ ] 代码分割
- [ ] 缓存策略

## 🌐 自定义域名（可选）

### Vercel 自定义域名
1. 在 Vercel 项目设置中添加域名
2. 配置 DNS 记录
3. 等待 SSL 证书自动配置

### Netlify 自定义域名
1. 在 Netlify 项目设置中添加域名
2. 配置 DNS 记录
3. 等待 SSL 证书自动配置

## 📱 移动端优化

确保应用在移动设备上正常运行：
- 响应式设计已实现
- 触摸友好的按钮大小
- 移动端导航优化

## 🔒 安全考虑

- 数据仅存储在浏览器本地存储
- 无敏感信息传输
- 静态部署，无服务器安全风险

## 📊 监控和分析

### Vercel Analytics
- 自动集成 Vercel Analytics
- 查看访问统计和性能指标

### Google Analytics（可选）
在 `_app.tsx` 中添加：
```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
    </>
  )
}
```

## 🚨 故障排除

### 常见问题
1. **构建失败**：检查 Node.js 版本和依赖
2. **路由问题**：确保 Next.js 配置正确
3. **样式问题**：检查 Tailwind CSS 配置
4. **数据丢失**：本地存储数据不会持久化

### 联系支持
- Vercel 支持：https://vercel.com/help
- Netlify 支持：https://docs.netlify.com

## 🎉 部署完成

部署成功后，您将获得一个公开的 URL，可以分享给其他人使用您的跑步打卡应用！

**示例 URL**：`https://your-app-name.vercel.app`
