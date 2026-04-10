# --- Stage 1: Build ---
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
RUN npm run build

# --- Stage 2: Serve với Nginx ---
FROM nginx:alpine

# Copy build output vào nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Config nginx cho SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
