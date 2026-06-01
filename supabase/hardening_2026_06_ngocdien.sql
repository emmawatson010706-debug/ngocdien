-- ============================================================
-- NGOCDIEN.INFO.VN - SECURITY HARDENING MIGRATION
-- Chạy trong Supabase SQL Editor sau khi backup database.
-- Mục tiêu: chỉ admin_profiles.role in ('super_admin','editor') mới được quản trị.
-- ============================================================

-- 1) Hàm kiểm tra admin theo admin_profiles
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
      and ap.role in ('super_admin', 'editor')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- 2) Bổ sung trường chuẩn hóa bài viết nếu chưa có
alter table public.articles add column if not exists source_note text;
alter table public.articles add column if not exists editor_name text;
alter table public.articles add column if not exists document_type text;

-- 3) Xóa policy cũ quá rộng
DROP POLICY IF EXISTS "Admins full access articles" ON public.articles;
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admins manage people" ON public.people;
DROP POLICY IF EXISTS "Admins manage podcasts" ON public.podcasts;
DROP POLICY IF EXISTS "Admins read submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins update submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins manage media" ON public.media;
DROP POLICY IF EXISTS "Admins update settings" ON public.settings;

-- 4) Tạo policy admin chặt hơn
create policy "Editors manage articles"
  on public.articles for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Editors manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Editors manage people"
  on public.people for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Editors manage podcasts"
  on public.podcasts for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Editors read submissions"
  on public.submissions for select
  using (public.is_admin());

create policy "Editors update submissions"
  on public.submissions for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Editors manage media"
  on public.media for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Editors manage settings"
  on public.settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- 5) RLS cho admin_profiles
alter table public.admin_profiles enable row level security;
DROP POLICY IF EXISTS "Admins read admin_profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super admins manage admin_profiles" ON public.admin_profiles;

create policy "Editors read admin_profiles"
  on public.admin_profiles for select
  using (public.is_admin() or id = auth.uid());

create policy "Super admins manage admin_profiles"
  on public.admin_profiles for all
  using (
    exists (
      select 1 from public.admin_profiles ap
      where ap.id = auth.uid() and ap.role = 'super_admin'
    )
  )
  with check (
    exists (
      select 1 from public.admin_profiles ap
      where ap.id = auth.uid() and ap.role = 'super_admin'
    )
  );

-- 6) Storage policies: public read, only admin write/update/delete
-- Lưu ý: nếu policy đã tồn tại với tên khác, vào Storage > Policies kiểm tra và xóa policy upload public cũ.
DROP POLICY IF EXISTS "Public read media storage" ON storage.objects;
DROP POLICY IF EXISTS "Editors upload media storage" ON storage.objects;
DROP POLICY IF EXISTS "Editors update media storage" ON storage.objects;
DROP POLICY IF EXISTS "Editors delete media storage" ON storage.objects;

create policy "Public read media storage"
  on storage.objects for select
  using (bucket_id in ('media','documents','podcasts'));

create policy "Editors upload media storage"
  on storage.objects for insert
  with check (bucket_id in ('media','documents','podcasts') and public.is_admin());

create policy "Editors update media storage"
  on storage.objects for update
  using (bucket_id in ('media','documents','podcasts') and public.is_admin())
  with check (bucket_id in ('media','documents','podcasts') and public.is_admin());

create policy "Editors delete media storage"
  on storage.objects for delete
  using (bucket_id in ('media','documents','podcasts') and public.is_admin());

-- 7) Kiểm tra user admin đầu tiên
-- Nếu chưa có hồ sơ admin, thay UUID/email theo user trong Authentication > Users.
-- insert into public.admin_profiles (id, display_name, role)
-- values ('00000000-0000-0000-0000-000000000000', 'Hồ Nam Tấn', 'super_admin')
-- on conflict (id) do update set role = 'super_admin';
