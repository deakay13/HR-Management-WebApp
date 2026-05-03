<div align="center">
  
# 🚀 HR Management Web Application

**Hệ thống Quản trị Nhân sự Siêu Tốc & Toàn Diện**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MSSQL](https://img.shields.io/badge/MSSQL-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver)](https://www.microsoft.com/en-us/sql-server)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg?style=for-the-badge)]()

*Giải pháp quản trị từ xa hiện đại, giúp doanh nghiệp quản lý thông tin nhân viên, hợp đồng, tự động hoá tính lương và phân quyền đa lớp.*

---
</div>

## 📖 Giới thiệu (Introduction)
HR Management Web Application là một nền tảng quản trị nhân sự hoàn chỉnh hoạt động đa nền tảng (Web-based). Ưu tiên tốc độ, tính bảo mật và trải nghiệm người dùng với các giao diện (UI) tiên tiến sử dụng **Shadcn UI & Tailwind CSS v4**. Kiến trúc được chuẩn hoá bằng **Docker Compose**, tích hợp **Redis Caching**, và được trang bị bộ Testing Suite đạt **độ phủ (Coverage) 100%** cho cả Backend API lẫn Frontend UI Components.

## ✨ Bảng Tính Năng Đột Phá (Key Features)

### 👥 1. Quản Trị Nhân Sự & Chấm Công
- **Hồ sơ nhân viên**: Quản lý chi tiết data nhân sự, phòng ban, tải avatar, văn bằng.
- **Hợp đồng lao động**: Mẫu hợp đồng điện tử, chu kỳ gia hạn, theo dõi biểu đồ nhân sự.
- **Giờ làm việc**: Chấm công, theo dõi vắng mặt nghỉ phép.

### 💰 2. Quản Trị Lương Thưởng (Payroll System)
- Số hoá hoàn toàn cấu trúc thu nhập: **Lương cơ bản**, **Phụ cấp**, và **Khấu trừ**.
- Tự động sinh bảng lương chi tiết và chuẩn xác vào cuối kỳ dựa trên công thức linh hoạt.
- **Xuất Excel (Export)** dữ liệu động nhanh chóng.

### 🛡️ 3. Phân Quyền Nâng Cao (RBAC)
- **Tài khoản**: Quản trị tài khoản đăng nhập an toàn với mã hoá Bcrypt.
- **Vai trò (Roles) & Quyền hạn (Permissions)**: Cơ chế phần quyền chi tiết (Employee, HR, Admin), khóa truy cập các trang nhạy cảm bảo vệ dữ liệu công ty.
- Tự động thay đổi Sidebar Navigation phù hợp với quyền hạn của mỗi chức vụ được cấp.

### 🎨 4. Trải Nghiệm Giao Diện (Premium UX/UI)
- Hỗ trợ đa ngôn ngữ (i18n).
- Tùy chỉnh **Dark Mode** & **Light Mode** liền mạch.
- Tối ưu SPA cực nhanh cùng Vite & Nginx Proxy.
- Dashboard báo cáo tích hợp biểu đồ tương tác thời gian thực.

---

## 🏗️ Kiến Trúc Công Nghệ (Tech Stack)

### **Frontend** (Client-side)
- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Shadcn/ui (Radix UI)
- **State Management**: Zustand, React Query (TanStack Query)
- **Routing**: React Router v7
- **Testing**: Vitest & React Testing Library (100% Coverage)

### **Backend** (Server-side)
- **Runtime**: Node.js v22 (Alpine)
- **Framework**: Express.js
- **ORM / Database**: Sequelize / Microsoft SQL Server (MSSQL 2022)
- **Caching**: Redis
- **Authentication**: JWT (Access Token & Refresh Token) với Cookies.
- **Testing**: Jest (100% Controller Coverage)

### **DevOps & Deploy**
- **Containerization**: Docker & Docker Compose (Tối ưu Multi-stage build, `--omit=dev` mode)
- **Web Server**: Nginx (Tối ưu SPA Fallback và static cache)

---

## 📁 Cấu Trúc Thư Mục (Project Structure)

```text
📦 HR-Management-WebApp
 ┣ 📂 Backend                 # RESTful API bằng Express.js & Sequelize
 ┃ ┣ 📂 config                # Cấu hình Database & Server
 ┃ ┣ 📂 migrations            # Quản lý version Schema MSSQL
 ┃ ┣ 📂 seeders               # Dữ liệu khởi tạo (Tài khoản mẫu, quyền)
 ┃ ┣ 📂 src                   # Chứa Controllers, Models, Routes logic chính
 ┃ ┣ 📂 tests                 # Unit Tests (Jest) cho Controllers & Services
 ┃ ┣ 📜 entrypoint.sh         # Tập lệnh auto-run Migration khi khởi động Docker
 ┃ ┗ 📜 Dockerfile            # Cấu hình container Backend Node (Non-root user optimized)
 ┣ 📂 Frontend                # Giao diện SPA bằng Vite & Core React
 ┃ ┣ 📂 src                   
 ┃ ┃ ┣ 📂 components          # UI Component (auth, managements, workspaces, systems, ui)
 ┃ ┃ ┣ 📂 hooks               # Custom Hooks (Query/Mutation)
 ┃ ┃ ┣ 📂 pages               # Tầng hiển thị cao nhất (Portal)
 ┃ ┃ ┣ 📂 stores              # Zustand Stores (User, Auth)
 ┃ ┃ ┣ 📂 test                # Unit Tests (Vitest) cho UI Components & Stores
 ┃ ┃ ┗ 📜 index.css           # Cấp phát biến Design System (Tokens, Themes, Tailwind)
 ┃ ┣ 📜 Dockerfile            # Quá trình đa bước Build & Bundle Nginx
 ┃ ┗ 📜 nginx.conf            # Chống cache index.html và proxy-pass API config
 ┣ 📜 docker-compose.yml      # Cấu hình orchestration cho mssql, redis, backend, frontend
 ┣ 📜 .env                    # (KHÔNG COMMIT) Biến môi trường CẤP ROOT
 ┗ 📜 .env.example            # Template tham khảo cho biến môi trường
```

---

## 🚀 Hướng Dẫn Cài Đặt Dành Cho Môi Trường Tự Động (Docker)

Toàn bộ Backend, Frontend, Redis và Database đều đã cấu hình đồng bộ ở file `docker-compose.yml` cùng hệ thống healthcheck tự động. Hệ thống sẽ tự động chờ DB và Redis sẵn sàng, sau đó chạy `Migrate` để tạo bảng và nạp dữ liệu mồi (Seeding).

### 🛠 Yêu cầu tiên quyết
- Máy tính hoặc Server của bạn cần cài đặt sẵn: 
  👉 [Docker](https://docs.docker.com/get-docker/) và Docker Compose.

### 🏃 Các Bước Chạy Ứng Dụng

**Bước 1: Clone toàn bộ dự án về máy**
```bash
git clone https://.../HR-Management-WebApp.git
cd HR-Management-WebApp
```

**Bước 2: Cài đặt Biến Môi Trường (Environment Variables)**
Mọi biến môi trường nay đã được **quy về một file `.env` duy nhất tại thư mục Root**.
- Mở file `.env.example`, copy nội dung và tạo một file mới tên là `.env` tại **thư mục gốc** (`/HR-Management-WebApp`).
- Đổi các giá trị như `SA_PASSWORD`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` thành mật khẩu bảo mật của riêng bạn.

**Bước 3: Khởi chạy bằng Docker**
Chỉ bằng 1 câu lệnh quyền lực duy nhất tại thư mục ngoài cùng:

```bash
docker compose up -d --build
```
*Lưu ý: Quá trình pull images (bản base alpine Node, Redis và MSSQL) có thể tốn vài phút tùy thuộc vào mạng.*

**Bước 4: Trải Nghiệm Ứng Dụng**
- **Frontend App**: `http://localhost:80` (hoặc cấu hình cổng tùy chọn trong compose).
- **Backend API**: Nginx tự động proxy các request `/api/` qua Backend ở cổng 5000 ngầm định.

---

## 🔒 Quy Ước Biến Môi Trường (Single Source of Truth)

Không còn chia nhỏ file `.env`, tất cả được gom vào ROOT:
```env
# ==================== DOCKER / DB ====================
SA_PASSWORD=MatKhauMSSQL123!
ACCEPT_EULA=Y
MSSQL_PID=Developer

# ==================== BACKEND ====================
DB_HOST=mssql
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=MatKhauMSSQL123!
DB_DATABASE=HRManagement
DB_DIALECT=mssql

ACCESS_TOKEN_SECRET=ChuoiSecretDuDaiVaBaoMat64KiTu
REFRESH_TOKEN_SECRET=ChuoiSecretDuDaiVaBaoMat64KiTu

CLIENT_URL=http://localhost
REDIS_HOST=redis
REDIS_PORT=6379

# ==================== FRONTEND ====================
VITE_API_URL=http://localhost:5000
FRONTEND_PORT=3000
```
*(File này đã được chặn commit bởi `.gitignore` và `.dockerignore`).*

---

## 🧪 Testing System

Dự án chú trọng cực lớn vào độ ổn định phần mềm:
- **Backend**: Chạy `npm run test` để kích hoạt Jest (Full Mocking ORM). Đạt 100% Branch & Line coverage.
- **Frontend**: Chạy `npm run test` để kích hoạt Vitest & RTL. Đã bao phủ toàn bộ Store, Custom Hook và UI/Action Component.

---

## ⚠️ Khuyến Cáo Bảo Mật (Security Note)
- **Không bao giờ Commit file `.env`**.
- Dự án sử dụng `npm ci --omit=dev` để build Docker production. Hãy đảm bảo các gói package cần thiết ở runtime luôn nằm đúng mục `dependencies` (VD: `exceljs`).

---

## ✍️ Đội Ngũ Phát Triển (Authors)

Được thiết kế và phát triển với các quy chuẩn Design UX/UI cao ngặt từ file kiến trúc của dự án. 
Vui lòng tuân thủ chặt chẽ `agent-coding-standards` và `api-standards` nếu muốn đóng góp commit vào codebase này.

> Xin cảm ơn bạn đã quan tâm. Hãy sẵn sàng trải nghiệm một trạng thái quản trị vượt trội! 🚀
