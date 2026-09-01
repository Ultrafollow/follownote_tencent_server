# 博客部署流程（PM2 + Nginx 自托管）

本项目的技术栈：Next.js 15.2.4（App Router）+ Supabase + MDX。

部署目标：一台国内（或香港）云服务器，通过 Nginx 反向代理 + HTTPS 对外提供服务。

---

## 0. 架构总览

```
用户浏览器
    │  https://www.followxu.top
    ▼
Nginx（反向代理 + HTTPS 证书）
    │  proxy_pass
    ▼
Node.js（next start，监听 127.0.0.1:3000）
    │  PM2 守护进程（崩溃自动重启）
    ▼
Supabase（数据库，云端，无需在服务器部署）
```

---

## 1. 购买服务器

| 项 | 推荐配置 |
|----|----------|
| 平台 | 阿里云 / 腾讯云 轻量应用服务器 |
| 规格 | 2核 4G 内存（构建 Next.js 较吃内存，4G 更稳） |
| 系统盘 | 60G SSD |
| 带宽 | 3~5 Mbps |
| 系统 | Ubuntu 22.04 LTS（或 Debian 12） |
| 地域 | 香港（免备案）或 大陆节点（需 ICP 备案） |

> 大陆节点绑定域名前必须先完成 ICP 备案，周期约 1~3 周；
> 香港节点免备案，当天即可上线，但大陆访问速度略逊。

---

## 2. 服务器初始化（一次性）

SSH 登录服务器后执行：

### 2.1 安装基础工具

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential nginx
```

### 2.2 安装 nvm + Node 20

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# 安装并切换到 Node 20
nvm install 20
nvm alias default 20
nvm use 20
node -v   # 应显示 v20.x.x
```

### 2.3 安装 PM2

```bash
npm install -g pm2
```

### 2.4 创建部署目录

```bash
sudo mkdir -p /var/www/follow_note
sudo chown -R $USER:$USER /var/www/follow_note
```

---

## 3. 上传项目代码

两种方式任选其一：

**方式 A：Git 拉取（推荐，后续更新方便）**

先把项目推送到 GitHub/Gitee 私有仓库，然后：

```bash
cd /var/www/follow_note
git clone <你的仓库地址> .
```

**方式 B：本机直接上传**

在本机（Windows）执行：

```powershell
scp -r f:\blog\follow_note\* 用户名@服务器IP:/var/www/follow_note/
```

---

## 4. 配置生产环境变量 ⚠️ 重点

Next.js 在 `next start` 时只加载 `.env.production` 和 `.env.local`，
**不会**加载 `.env.development.local`。

因此你需要把本机两个文件里的变量合并到一个生产文件里：

```bash
cd /var/www/follow_note

# 把 .env.local 复制为 .env.production
cp .env.local .env.production

# 然后把 .env.development.local 里所有变量
# （NEXT_PUBLIC_SUPABASE_URL / SUPABASE_* / POSTGRES_* / ALLOWED_USERS_ID 等）
# 追加进 .env.production
```

编辑确认：

```bash
nano .env.production
```

关键变量清单（确保都包含）：

- `AUTH_SECRET`、`AUTH_GITHUB_ID`、`AUTH_GITHUB_SECRET`、`AUTH_TRUST_HOST`
- `SITE_URL`（生产环境改成 `https://www.followxu.top/`）
- `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`、`SUPABASE_ANON_KEY`
- `ALLOWED_USERS_ID`、`NEXT_PUBLIC_ALLOWED_USERS_ID`
- `DEFAULT_SESSION_ID`、`NEXT_PUBLIC_DEFAULT_SESSION_ID`

> ⚠️ 注意：`.env.production` 含敏感密钥，务必加入 `.gitignore`，不要提交到仓库。

---

## 5. 构建并启动

### 5.1 安装依赖并构建

```bash
cd /var/www/follow_note
npm ci          # 或 npm install
npm run build   # 生产构建（首次可能较慢）
```

### 5.2 用 PM2 启动

项目根目录已提供 `ecosystem.config.js`，直接：

```bash
pm2 start ecosystem.config.js
pm2 save                    # 保存进程列表
pm2 startup                 # 生成开机自启命令，按提示执行
```

常用 PM2 命令：

```bash
pm2 status          # 查看状态
pm2 logs follow_note    # 查看日志
pm2 restart follow_note # 重启
pm2 reload follow_note  # 平滑重载
```

验证本地服务：

```bash
curl http://127.0.0.1:3000   # 应返回首页 HTML
```

---

## 6. 配置 Nginx + HTTPS

### 6.1 申请 HTTPS 证书（免费）

用 Let's Encrypt（需域名已解析到本服务器 IP）：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d followxu.top -d www.followxu.top
```

按提示选择"强制跳转 HTTPS"。证书会自动续期。

### 6.2 配置反向代理

编辑 Nginx 站点配置：

```bash
sudo nano /etc/nginx/sites-available/follow_note
```

内容参考项目根目录的 `nginx.conf`（注意证书路径以 certbot 实际生成的为准，
通常是 `/etc/letsencrypt/live/followxu.top/fullchain.pem` 和 `privkey.pem`）。

启用并重载：

```bash
sudo ln -s /etc/nginx/sites-available/follow_note /etc/nginx/sites-enabled/
sudo nginx -t          # 测试配置
sudo systemctl reload nginx
```

---

## 7. 域名解析

在域名服务商后台，为 `followxu.top` 和 `www.followxu.top` 添加 **A 记录**，指向服务器公网 IP。

解析生效后（约几分钟~几小时），访问 `https://www.followxu.top` 即可。

---

## 8. 后续更新部署（每次发新版）

在服务器执行：

```bash
cd /var/www/follow_note
bash deploy.sh
```

或手动：

```bash
cd /var/www/follow_note
git pull origin main
npm ci
npm run build
pm2 reload follow_note
```

---

## 常见问题

- **构建时内存不足（OOM）**：升级到 4G 内存，或临时加 swap：
  `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`
- **访问 Supabase 慢**：数据库在海外，国内访问会有延迟，可考虑迁回国内云数据库或加代理。
- **502 Bad Gateway**：通常是 Node 进程没起来，`pm2 logs` 查看报错。
- **静态资源 404**：确认 Nginx 里 `proxy_pass` 指向 `http://127.0.0.1:3000`，且 Node 监听 3000 端口。
