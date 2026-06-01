# HƯỚNG DẪN TRIỂN KHAI BẢN VÁ BẢO MẬT & NÂNG CẤP NGỌC ĐIỀN

## 1. Cập nhật mã nguồn
1. Giải nén file `ngocdien-secure-upgrade-2026.zip`.
2. Copy toàn bộ thư mục `ngocdien` đè lên dự án hiện tại hoặc mở riêng bằng VS Code để kiểm tra.
3. Chạy:

```bash
npm install
npm run build
npm run dev
```

Nếu build ổn, commit và push lên GitHub để Vercel tự deploy.

## 2. Biến môi trường trên Vercel
Xóa biến cũ:
- `NEXT_PUBLIC_OWM_API_KEY`
- `NEXT_PUBLIC_OWM_CITY`

Thêm biến mới:
- `OWM_API_KEY`
- `OWM_CITY=1568574`
- `NEXT_PUBLIC_SITE_URL=https://www.ngocdien.info.vn`

Giữ lại:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3. Chạy SQL hardening trong Supabase
Vào Supabase Dashboard > SQL Editor, chạy file:

`supabase/hardening_2026_06_ngocdien.sql`

Sau đó vào Authentication > Users, lấy UUID tài khoản admin của anh, rồi chạy câu insert `admin_profiles` ở cuối file SQL, thay UUID thật.

## 4. Tắt public sign-up nếu website không cho người ngoài đăng ký
Vào Supabase Dashboard:

Authentication > Providers > Email

Tắt mục cho phép đăng ký công khai nếu chỉ có tài khoản quản trị nội bộ. Tên mục có thể là `Enable email signups` hoặc `Allow new users to sign up` tùy giao diện Supabase.

## 5. Xoay lại service role key
Sau khi deploy bản mới và chạy SQL:

Project Settings > API > Service role key > Rotate / Regenerate

Sau đó cập nhật lại biến `SUPABASE_SERVICE_ROLE_KEY` trên Vercel và redeploy.

## 6. Kiểm tra sau deploy
- Mở trang chủ.
- Mở `/admin/login`, đăng nhập tài khoản admin.
- Tạo bài nháp, upload ảnh, đăng bài.
- Thử mở `/api/articles` bằng GET: phải đọc được bài công khai.
- Thử POST `/api/articles` khi chưa đăng nhập: phải bị chặn 403.
- Thử upload khi chưa đăng nhập: phải bị chặn 403.
- Kiểm tra trang mới:
  - `/tu-lieu-ngoc-dien`
  - `/tra-cuu-nguoi-ngoc-dien`
  - `/ban-bien-tap`

## 7. Những điểm đã sửa trong bản này
- Chặn tạo/sửa/xóa bài viết qua API nếu không phải admin.
- Chặn upload nếu không phải admin; giới hạn 8MB và chỉ cho định dạng ảnh, PDF, audio.
- Sanitize HTML bài viết trước khi lưu và trước khi hiển thị.
- Nâng Next.js lên 14.2.25.
- Đổi OpenWeatherMap sang server-only API.
- Ẩn link quản trị khỏi header/footer công khai.
- Thêm security headers và CSP.
- Thêm SQL RLS hardening dựa trên `admin_profiles`.
- Thêm trang Tư liệu Ngọc Điền.
- Thêm trang Tra cứu người Ngọc Điền.
- Thêm trang Ban biên tập & Quy chế đăng bài.
- Tạo favicon và ảnh chia sẻ Facebook 1200×630.
