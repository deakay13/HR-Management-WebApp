FROM node:22-alpine

WORKDIR /app

# Cài dependencies — chỉ production để giảm image size
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy source code (bao gồm entrypoint.sh)
COPY . .
RUN chmod +x /app/entrypoint.sh

EXPOSE 5000

CMD ["/app/entrypoint.sh"]
