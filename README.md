<div align="center">
  
# 🚀 HR Management Web Application

**Hệ thống Quản trị Nhân sự Siêu Tốc & Toàn Diện**

[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MSSQL](https://img.shields.io/badge/MSSQL-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver)](https://www.microsoft.com/en-us/sql-server)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

*Giải pháp quản trị từ xa hiện đại, giúp doanh nghiệp quản lý từ thông tin nhân viên, hợp đồng cho đến tự động hoá tính lương và phân quyền đa lớp.*

---
</div>

## 📖 Giới thiệu (Introduction)
HR Management Web Application là một nền tảng quản trị nhân sự hoàn chỉnh hoạt động đa nền tảng (Web-based). Ưu tiên tốc độ, tính bảo mật và trải nghiệm người dùng với các giao diện (UI) tiên tiến sử dụng Shadcn UI & Tailwind CSS v4. Kiến trúc được chuẩn hoá bằng **Docker Compose**, giúp cô lập môi trường và dễ dàng deploy lên bất cứ cấu hình máy chủ nào chỉ với một câu lệnh.

## ✨ Bảng Tính Năng Đột Phá (Key Features)

### 👥 1. Quản Trị Nhân Sự & Chấm Công
- **Hồ sơ nhân viên**: Quản lý chi tiết data nhân sự, phòng ban, tải avatar, văn bằng.
- **Hợp đồng lao động**: Mẫu hợp đồng điện tử, chu kỳ gia hạn, theo dõi biểu đồ nhân sự hết hạn hợp đồng.
- **Giờ làm việc**: Chấm công, theo dõi vắng mặt nghỉ phép.

### 💰 2. Quản Trị Lương Thưởng (Payroll System)
- Số hoá hoàn toàn cấu trúc thu nhập: **Lương cơ bản**, **Phụ cấp**, và **Khấu trừ**.
- Tự động sinh bảng lương chi tiết và chuẩn xác vào cuối kỳ dựa trên công thức linh hoạt.

### 🛡️ 3. Phân Quyền Nâng Cao (RBAC)
- **Tài khoản**: Quản trị tài khoản đăng nhập an toàn (băm mật khẩu).
- **Vai trò (Roles) & Quyền hạn (Permissions)**: Cơ chế phần quyền chi tiết (Employee, HR, Admin), khóa truy cập các trang nhạy cảm bảo vệ dữ liệu công ty.
- Tự động thay đổi Sidebar Navigation phù hợp với quyền hạn của mỗi chức vụ được cấp.

### 🎨 4. Trải Nghiệm Giao Diện (Premium UX/UI)
- Hỗ trợ đa ngôn ngữ (i18n).
- Tùy chỉnh **Dark Mode** & **Light Mode** liền mạch.
- Tối ưu SPA cực nhanh cùng Vite & Nginx Proxy.
- Dashboard báo cáo tích hợp KPI theo thời gian thực.

---

## 🏗️ Kiến Trúc Công Nghệ (Tech Stack)

### **Frontend** (Client-side)
- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Routing**: React Router
- **Internationalization**: i18next

### **Backend** (Server-side)
- **Runtime**: Node.js v22 (Alpine)
- **Framework**: Express.js
- **ORM / Database**: Sequelize / Microsoft SQL Server (MSSQL 2022)
- **Authentication**: JWT (Access Token & Refresh Token)

### **DevOps & Deploy**
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (Tối ưu SPA Fallback và static cache)

---

## 📁 Cấu Trúc Thư Mục (Project Structure)

```text
📦 HR-Management-WebApp
 ┣ 📂 Backend                 # RESTful API bằng Express.js & Sequelize
 ┃ ┣ 📂 config                # Cấu hình Database & Server
 ┃ ┣ 📂 migrations            # Quản lý version Schema MSSQL
 ┃ ┣ 📂 scripts               # Scripts bổ trợ
 ┃ ┣ 📂 seeders               # Dữ liệu khởi tạo (Tài khoản mẫu, quyền)
 ┃ ┣ 📂 src                   # Chứa Controllers, Models, Routes logic chính
 ┃ ┣ 📜 entrypoint.sh         # Tập lệnh auto-run Migration khi khởi động Docker
 ┃ ┣ 📜 Dockerfile            # Cấu hình container Backend Node
 ┃ ┗ ...
 ┣ 📂 Frontend                # Giao diện SPA bằng Vite & Core React
 ┃ ┣ 📂 public                # Static HTML, placeholder images
 ┃ ┣ 📂 src                   
 ┃ ┃ ┣ 📂 components          # UI Component (auth, managements, workspaces, systems, ui)
 ┃ ┃ ┣ 📂 pages               # Tầng hiển thị cao nhất (Portal)
 ┃ ┃ ┣ 📂 stores              # Zustand Stores (User, Auth)
 ┃ ┃ ┣ 📂 utils               # Helpers logic phân quyền, JWT formatter
 ┃ ┃ ┗ 📜 index.css           # Cấp phát biến Design System (Tokens, Themes, Tailwind)
 ┃ ┣ 📜 Dockerfile            # Quá trình đa bước Build & Bundle Nginx
 ┃ ┣ 📜 nginx.conf            # Chống cache index.html và proxy-pass API config
 ┃ ┗ ...
 ┗ 📜 docker-compose.yml      # Bản phác thảo 3 quy trình (mssql, frontend, backend)
```

---

## 🚀 Hướng Dẫn Cài Đặt Dành Cho Môi Trường Tự Động (Docker)

Toàn bộ Backend, Frontend và Database đều đã cấu hình đồng bộ ở file `docker-compose.yml`. Môi trường Database SQL Server cũng sẽ tự động chạy lệnh `Migrate` để tạo bảng và nạp dữ liệu mồi (Seeding).

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
Tại mỗi thư mục, bạn copy template biến môi trường và đổi tên thành `.env`
- Ở thư mục `Backend`: Bạn cần cấu hình username `SA_PASSWORD` và các `SECRET_KEY` cho Token (Xem `Backend/.env.example` nếu có).

**Bước 3: Khởi chạy bằng Docker**
Chỉ bằng 1 câu lệnh quyền lực duy nhất tại thư mục ngoài cùng chứa file `docker-compose.yml`:

```bash
docker compose up -d --build
```
*Lưu ý: Quá trình pull images (bản base alpine Node và MSSQL) có thể tốn vài phút tùy thuộc vào kết nối mạng.*

**Bước 4: Trải Nghiệm Ứng Dụng**
- **Frontend App**: `http://localhost:80`
- **Backend API Docs**: `http://localhost:5000` (Nếu có cấu hình Swagger)

---

## 🔧 Các Công Cụ Và Lệnh Phát Triển Gỡ Lỗi

Khi bạn thay đổi mã nguồn trong quá trình dev:
- **Build lại duy nhất Frontend (Nếu sửa React CSS/HTML)**:
  ```bash
  docker compose up -d --build hr-frontend
  ```
- **Build lại duy nhất Backend (Nếu sửa Logic Node.js)**:
  ```bash
  docker compose up -d --build hr-backend
  ```
- Tắt hoàn toàn Service và network liên đới:
  ```bash
  docker compose down
  ```

---

## 🔒 Quy Ước Biến Môi Trường

Thư mục `Backend` cần file `.env` với các fields quan trọng:
```env
PORT=5000
DB_HOST=mssql
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=<Mật Khẩu Phức Tạp>
DB_DATABASE=HRManagement
DB_DIALECT=mssql
CLIENT_URL=http://localhost
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
```
*(File này đã được ignore bằng `.dockerignore` và `.gitignore` để tránh rò rỉ lên repo).*

---

## ✍️ Đội Ngũ Phát Triển (Authors)

Được thiết kế và phát triển với các quy chuẩn Design UX/UI cao ngặt từ file kiến trúc của dự án. 

Vui lòng tuân thủ chặt chẽ `agent-coding-standards` và `api-standards` nếu muốn đóng góp commit vào codebase này.

---
> Xin cảm ơn bạn đã quan tâm. Hãy sẵn sàng trải nghiệm một trang thái quản trị vượt trội! 🚀
