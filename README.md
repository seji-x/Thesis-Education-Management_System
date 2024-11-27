# 📚 Hệ Thống Quản Lý Lớp Học và Điểm Số Học Sinh

## 🖋️ Tác Giả
Dự án được thực hiện bởi **Nguyễn Thái Dương**, sinh viên lớp **20CT2**, mã số sinh viên **2051220053** tại **Đại học Kiến trúc Đà Nẵng**.

---

## 📜 Giới Thiệu
Hệ thống **Quản lý lớp học và điểm số học sinh** là một ứng dụng web nhằm tối ưu hóa quy trình quản lý giáo dục, hỗ trợ quản lý thông tin học sinh, giáo viên, lớp học, môn học, điểm số và thời khoá biểu.

Dự án được xây dựng với:
- **Backend:** Django (Python)
- **Frontend:** Next.js (React)
- **Cơ sở dữ liệu:** PostgreSQL

### 🌟 Tính năng nổi bật:
- **Quản lý thông tin người dùng:** Admin, giáo viên, học sinh.
- **Quản lý điểm số:** Nhập, xem và chỉnh sửa điểm.
- **Thời khoá biểu:** Xem lịch học và giảng dạy.
- **Thông báo tức thời:** Gửi thông báo giữa admin, giáo viên, học sinh.
- **Tìm kiếm nhanh:** Lớp học, môn học, người dùng.

---

## 🚀 Các Nhánh của Repository

Dự án này có hai nhánh chính:

### 1. **Backend (Django)**

Nhánh này chứa phần **backend** của hệ thống, được xây dựng bằng **Django**. Backend xử lý các API, logic nghiệp vụ và quản lý cơ sở dữ liệu.

- **Liên kết:** [Backend Repository](https://github.com/seji-x/Thesis-Education-Management_System/tree/Backend?tab=readme-ov-file)

### 2. **Frontend (Next.js)**

Nhánh này chứa phần **frontend** của hệ thống, được xây dựng bằng **Next.js** (React). Frontend chịu trách nhiệm giao diện người dùng, kết nối với backend thông qua các API và tối ưu hóa trải nghiệm người dùng.

- **Liên kết:** [Frontend Repository](https://github.com/seji-x/Thesis-Education-Management_System/tree/Frontend)

## ⚙️ Công Nghệ Sử Dụng

- **Backend:** Django (Python)
- **Frontend:** Next.js (React)
- **Cơ sở dữ liệu:** PostgreSQL
- **Quản lý mã nguồn:** GitHub
- **Công cụ phát triển:** Visual Studio Code, Docker (tuỳ chọn)

## 🛠️ Hướng Dẫn Cài Đặt

### 1. **Cài Đặt Backend (Django)**

#### Bước 1: Clone Repository
```bash
git clone https://github.com/seji-x/Thesis-Education-Management_System.git
cd Thesis-Education-Management_System/backend
```
### Bước 2: Cài Đặt các Phụ Thuộc
Cài đặt các thư viện Python cần thiết thông qua pip:
```bash
pip install -r requirements.txt
```
### Bước 3: Cấu Hình Cơ Sở Dữ Liệu
Tạo và di chuyển cơ sở dữ liệu (Sử dụng PostgreSQL):
```bash
python manage.py migrate
```
## Bước 4: Tạo Superuser
Tạo tài khoản quản trị viên để truy cập vào phần admin:
```bash
python manage.py createsuperuser
```
### Bước 5: Chạy Server
Khởi chạy server backend:
```bash
python manage.py runserver
```
### 2. Cài Đặt Frontend (Next.js)**
### Bước 1: Clone Repository
```bash
git clone https://github.com/seji-x/Thesis-Education-Management_System.git
cd Thesis-Education-Management_System/frontend
```
### Bước 2: Cài Đặt các Phụ Thuộc
Cài đặt các thư viện Node.js cần thiết:
```bash
npm install
```
### Bước 3: Chạy Ứng Dụng
Khởi chạy ứng dụng frontend:
```bash
npm run dev
```
###Ứng dụng sẽ được chạy tại http://localhost:3000.
- 🔧 Các Tính Năng Chính
```
Quản lý người dùng: Quản trị viên có thể tạo, chỉnh sửa và xoá tài khoản của học sinh, giáo viên và admin.
Quản lý lớp học: Quản trị viên có thể tạo và chỉnh sửa các lớp học, phân công giáo viên cho các lớp.
Quản lý điểm số: Giáo viên có thể nhập điểm cho học sinh, xem và sửa điểm. Học sinh có thể theo dõi điểm của mình.
Thông báo: Quản trị viên và giáo viên có thể gửi thông báo đến học sinh và các giáo viên khác.
Thời khoá biểu: Giáo viên có thể xem lịch dạy, học sinh có thể xem lịch học của mình.
Tìm kiếm: Tính năng tìm kiếm giúp người dùng nhanh chóng tìm kiếm các lớp học, học sinh, giáo viên và môn học.
```

📦 Cài Đặt và Triển Khai với Docker (Tuỳ Chọn)
Để chạy dự án với Docker, bạn có thể sử dụng docker-compose để khởi tạo cả frontend và backend trong một môi trường container.
Bước 1: Tạo Docker Image cho Backend và Frontend
```bash
docker-compose up --build
```
Bước 2: Truy Cập Ứng Dụng
```bash
Backend: http://localhost:8000
Frontend: http://localhost:3000
```
📝 Cấu Hình
Cấu hình môi trường cho Django
Tạo một file .env trong thư mục gốc của backend với nội dung như sau:
```bash
DEBUG=True
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
```
Cấu hình môi trường cho Next.js
Tạo một file .env.local trong thư mục frontend với nội dung như sau:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
🧑‍💻 Hướng Dẫn Phát Triển
1. Chạy Backend và Frontend Song Song
Để phát triển một cách hiệu quả, bạn có thể chạy backend và frontend song song. Đảm bảo rằng backend đang chạy tại http://localhost:8000 và frontend tại http://localhost:3000.

2. Cập Nhật API
- **Khi thực hiện thay đổi trong backend, hãy đảm bảo rằng bạn đã cập nhật các API và kiểm tra tính tương thích với frontend.**

3. Chạy Test
- **Để chạy các bài test trong Django:**
```
python manage.py test
```
- **Để chạy các bài test trong Next.js:**
```
npm run test
```
