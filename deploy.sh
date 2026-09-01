#!/usr/bin/env bash
set -e

APP_DIR="/var/www/follow_note"

cd "$APP_DIR"

# 加载 nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 || true

echo "==> 拉取最新代码"
git pull origin main

echo "==> 安装依赖"
npm ci || npm install

echo "==> 生产构建"
npm run build

echo "==> 重载 PM2 进程"
pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save

echo "==> 部署完成"
pm2 status
