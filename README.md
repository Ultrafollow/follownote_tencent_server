# Follow Note

基于 Next.js 15 构建的个人博客系统，支持 MDX 内容管理、GitHub OAuth 登录、Supabase 数据存储，部署于腾讯云 Lighthouse。

在线地址：[www.followxu.top](https://www.followxu.top)

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 15.2.4 (App Router) |
| 前端 | React 19、Tailwind CSS 3 |
| 内容 | MDX + gray-matter |
| 认证 | NextAuth.js v5 + GitHub OAuth |
| 数据库 | Supabase (PostgreSQL) |
| 评论 | Giscus |
| 搜索 | DocSearch |
| 部署 | PM2 + Nginx (腾讯云 Lighthouse) |

## 功能特性

- 📝 MDX 博客内容管理与渲染
- 🔐 GitHub OAuth 登录认证
- 💬 Giscus 评论系统
- 🔍 全文搜索
- 🌙 暗色模式切换
- 📊 标签词云
- ❄️ 雪花特效
- 📱 响应式设计

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务
npm start
```

## 环境变量

创建 `.env.production` 文件，配置以下变量：

```env
# GitHub OAuth
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret

# Auth.js
AUTH_SECRET=your_auth_secret
AUTH_TRUST_HOST=true

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# 站点
SITE_URL=https://www.followxu.top
```

## 部署

本项目部署于腾讯云 Lighthouse (Ubuntu)，使用 PM2 管理进程，Nginx 反向代理。

```bash
# PM2 启动
pm2 start ecosystem.config.js

# Nginx 配置参考
# 见项目根目录 nginx.conf
```

## 项目结构

```
├── app/                # Next.js App Router 页面
│   ├── api/            # API 路由
│   ├── blog/           # 博客页面
│   ├── admin/          # 管理后台
│   └── ...
├── components/         # React 组件
├── content/            # MDX 博客内容
├── data/               # 站点配置数据
├── public/             # 静态资源
├── utils/              # 工具函数
├── auth.js             # Auth.js 配置
├── next.config.js      # Next.js 配置
├── tailwind.config.js  # Tailwind 配置
└── ecosystem.config.js # PM2 配置
```

## License

MIT
