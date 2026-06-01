# Hướng dẫn sửa lỗi build/dev ngày 01/06/2026

Bản này sửa 2 lỗi anh gặp khi chạy `npm run build` và `npm run dev`:

1. `Type error: Binding element 'data' implicitly has an 'any' type` tại `src/app/admin/cai-dat/page.tsx`.
2. `createBrowserClient is not a function` tại `src/lib/supabase/client.ts` làm trang chủ bị lỗi 500.

## Việc đã sửa trong mã nguồn

- Đổi `src/lib/supabase/client.ts` sang dùng `createClient` từ `@supabase/supabase-js`.
- Bỏ import browser Supabase client ra khỏi `src/lib/supabase/queries.ts` để Server Component không kéo nhầm client module.
- Chuyển `incrementViewCount` sang dùng server Supabase client.
- Sửa typing tại `src/app/admin/cai-dat/page.tsx`.
- Nâng Next.js và eslint-config-next từ `14.2.25` lên `14.2.35`, theo khuyến nghị vá bảo mật cho dòng Next 14.x.

## Lệnh chạy lại trên máy anh

Xóa cache/build cũ trước:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
```

Cài lại dependency:

```powershell
npm install
npm run build
npm run dev
```

Nếu build OK thì commit:

```powershell
git add .
git commit -m "fix supabase client and update next security patch"
git push
```

## Lưu ý Supabase/Vercel

- Đảm bảo `.env.local` có đủ:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OWM_API_KEY`
- Trên Vercel cũng phải cập nhật các biến môi trường tương ứng rồi redeploy.
