# Hướng dẫn vá tiếp sau khi chạy bản FIXED

## 1. Kết quả tốt

Nếu log có dòng:

```txt
GET / 200
```

thì trang chủ đã chạy được. Đây là trạng thái tốt hơn bản lỗi trước.

## 2. /api/weather 503

Bản vá mới không còn trả 503 khi thiếu `OWM_API_KEY`. Nếu chưa cấu hình key thời tiết, API sẽ trả dữ liệu tham khảo để giao diện không bị lỗi.

Muốn dùng dữ liệu thật, thêm biến môi trường sau vào `.env.local` và Vercel:

```env
OWM_API_KEY=key_openweathermap_cua_anh
OWM_CITY=1568574
```

Không dùng lại `NEXT_PUBLIC_OWM_API_KEY` vì key public sẽ lộ ra trình duyệt.

## 3. /di-tich và /tieng-lang 404

Bản vá mới đã thêm danh mục mặc định trong code. Vì vậy các đường dẫn công khai như:

- `/di-tich`
- `/tieng-lang`
- `/lich-su`
- `/le-hoi`
- `/thu-vien`
- `/chuyen-doi-so`

sẽ không còn 404 ngay cả khi bảng `categories` trong Supabase chưa có đủ dữ liệu.

Tuy vậy, anh vẫn nên seed dữ liệu category trong Supabase để admin chọn chuyên mục đúng khi đăng bài.

## 4. Chrome DevTools 404

Dòng này không phải lỗi website:

```txt
GET /.well-known/appspecific/com.chrome.devtools.json 404
```

Đây là request phụ của Chrome DevTools. Bỏ qua được.

## 5. Chạy lại

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run build
npm run dev
```
