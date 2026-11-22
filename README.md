# SGCL | Hệ thống Quản lý Giám sát Tàu biển (Full-Stack v2)
Phụ trách & thực hiện: **Trương Nguyễn Bảo Ngọc**

Gồm đầy đủ 10 phân hệ nghiệp vụ đại lý tàu biển: Tổng quan & Biểu đồ, Quản lý tàu, Checklist kiểm soát CP1–CP3 (có cổng khóa điều kiện), Nhật ký hiện trường (lũy kế % B/L), Daily report nhiều ảnh, Đối chiếu B/L–Draft Survey–ROROC, Dòng thời gian SOF (kiểm tra logic mốc giờ + xuất phiếu SOF in PDF), Hình ảnh hiện trường, Cây thư mục chứng từ, và Bàn giao ca trực tự động cảnh báo ca chưa giao.

## Chạy trên máy (Local)
```bash
npm install
npm start
```
Mở trình duyệt tại `http://localhost:3000`.

## Đưa lên mạng (GitHub + Render.com)
1. Tải toàn bộ các file bên trong thư mục này lên kho GitHub (để `package.json`, `server.js`, `render.yaml` nằm ngay ngoài cùng).
2. Vào **render.com** → **New + → Web Service** → chọn kho GitHub → Build: `npm install`, Start: `npm start`, gói **Free** → bấm **Deploy Web Service**.
