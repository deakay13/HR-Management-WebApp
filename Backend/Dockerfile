FROM node:22-alpine

WORKDIR /app

# Cài dependencies trước để tận dụng Docker cache
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code
COPY . .

# Tạo thư mục uploads
RUN mkdir -p uploads/avatars uploads/hopdong

EXPOSE 5000

# Script khởi động: chạy migration + seed rồi start server
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]
