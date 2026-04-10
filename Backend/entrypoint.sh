#!/bin/sh
set -e

echo "🗄️  Tạo database nếu chưa tồn tại..."
npx sequelize-cli db:create --config config/config.js || echo "⚠️ Database đã tồn tại, bỏ qua..."

echo "⏳ Chạy Sequelize migrations..."
npx sequelize-cli db:migrate --config config/config.js

echo "🌱 Chạy Sequelize seeders..."
npx sequelize-cli db:seed:all --config config/config.js || echo "⚠️ Seed đã tồn tại hoặc lỗi, bỏ qua..."

echo "🚀 Khởi động server..."
exec node src/server.js
