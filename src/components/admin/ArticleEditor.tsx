'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { supabase } from '@/lib/supabase/client';
import { toSlug } from '@/lib/utils';
import type { Article, Category } from '@/types/database';

interface Props {
  article?: Article;
  categories: Category[];
}

export default function ArticleEditor({ article, categories }: Props) {
  const router = useRouter();
  const isEdit = !!article;

  const [form, setForm] = useState({
    title:       article?.title ?? '',
    slug:        article?.slug ?? '',
    excerpt:     article?.excerpt ?? '',
    category_id: article?.category_id ?? '',
    author_name: article?.author_name ?? 'Ban biên tập',
    tags:        article?.tags?.join(', ') ?? '',
    is_featured: article?.is_featured ?? false,
    is_published:article?.is_published ?? false,
  });

  const [thumbnailUrl, setThumbnailUrl] = useState(article?.thumbnail_url ?? '');
  const [uploading, setUploading]       = useState(false);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Youtube.configure({ controls: true }),
    ],
    content: article?.content ?? '<p>Bắt đầu viết nội dung bài...</p>',
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const autoSlug = (title: string) => {
    if (!isEdit) set('slug', toSlug(title));
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext  = file.name.split('.').pop();
    const path = `articles/${Date.now()}.${ext}`;
    const { data, error: err } = await supabase.storage.from('media').upload(path, file, { upsert: true });
    setUploading(false);
    if (err) { alert('Lỗi upload: ' + err.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
    setThumbnailUrl(publicUrl);
  };

  // 🔥 ĐÃ SỬA LẠI HÀM SAVE CHO KHỚP VỚI KÉT SẮT SUPABASE CỦA ANH 🔥
  const save = async (publish?: boolean) => {
    if (!form.title.trim()) { setError('Vui lòng nhập tiêu đề'); return; }
    setSaving(true); setError('');

    // Dịch các trường từ Form sang đúng tên cột trong Supabase
    const payload = {
      title:   form.title,
      slug:    form.slug || toSlug(form.title),
      cat:     form.category_id || 'tin-tuc', 
      date:    new Date().toLocaleDateString('vi-VN'),
      img:     thumbnailUrl || '',
      excerpt: form.excerpt || '',
      content: editor?.getHTML() ?? '',
    };

    const { error: err } = isEdit
      ? await supabase.from('articles').update(payload).eq('id', article!.id)
      : await supabase.from('articles').insert([payload]);

    setSaving(false);
    
    if (err) { 
      setError('Lỗi bơm dữ liệu: ' + err.message); 
      return; 
    }

    // NẾU THÀNH CÔNG SẼ HIỆN BẢNG THÔNG BÁO NÀY
    alert('🎉 ĐĂNG BÀI THÀNH CÔNG VÀO KÉT SẮT SUPABASE!\n\n(Lưu ý: Bạn sẽ bị chuyển về trang Danh sách. Vì trang Danh sách vẫn đang dùng số liệu ảo nên bạn sẽ chưa thấy bài hiện ra. Đừng lo, bài đã nằm an toàn trong kho!)');

    router.push('/admin/bai-viet');
    router.refresh();
  };

  return (
    <div className="max-w-[920px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-black">
          {isEdit ? '✏️ Sửa bài viết' : '✏️ Tạo bài viết mới'}
        </h1>
        <div className="flex gap-2">
          <button onClick={() => save(false)} disabled={saving}
            className="btn-outline text-sm py-2 disabled:opacity-60">
            💾 Lưu nháp
          </button>
          <button onClick={() => save(true)} disabled={saving}
            className="btn-primary text-sm py-2 disabled:opacity-60">
            🚀 {saving ? 'Đang lưu...' : 'Đăng bài'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red/10 border border-red/30 text-red text-sm font-sans rounded-lg px-4 py-3 mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        {/* Main */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="admin-label">Tiêu đề *</label>
            <input value={form.title} onChange={e => { set('title', e.target.value); autoSlug(e.target.value); }}
              placeholder="Nhập tiêu đề bài viết..."
              className="admin-input text-lg font-serif font-bold" />
          </div>

          {/* Slug */}
          <div>
            <label className="admin-label">Đường dẫn (slug)</label>
            <div className="flex">
              <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg px-3 py-2.5
                text-xs text-gray-400 font-sans flex items-center">/bai-viet/</span>
              <input value={form.slug} onChange={e => set('slug', e.target.value)}
                className="admin-input rounded-l-none flex-1" />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="admin-label">Mô tả ngắn (tóm tắt)</label>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
              rows={2} placeholder="2-3 câu mô tả bài viết, hiện trên trang chủ và khi chia sẻ..."
              className="admin-input resize-none" />
          </div>

          {/* Editor */}
          <div>
            <label className="admin-label">Nội dung bài viết *</label>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg">
              {[
                { label:'B', action:() => editor?.chain().focus().toggleBold().run(), title:'In đậm' },
                { label:'I', action:() => editor?.chain().focus().toggleItalic().run(), title:'In nghiêng' },
                { label:'H2', action:() => editor?.chain().focus().toggleHeading({ level:2 }).run(), title:'Tiêu đề 2' },
                { label:'H3', action:() => editor?.chain().focus().toggleHeading({ level:3 }).run(), title:'Tiêu đề 3' },
                { label:'•', action:() => editor?.chain().focus().toggleBulletList().run(), title:'Danh sách' },
                { label:'1.', action:() => editor?.chain().focus().toggleOrderedList().run(), title:'Đánh số' },
                { label:'❝', action:() => editor?.chain().focus().toggleBlockquote().run(), title:'Trích dẫn' },
                { label:'—', action:() => editor?.chain().focus().setHorizontalRule().run(), title:'Kẻ ngang' },
                { label:'🔗', action:() => {
                  const url = prompt('Nhập URL:');
                  if (url) editor?.chain().focus().setLink({ href: url }).run();
                }, title:'Link' },
                { label:'🖼', action:() => {
                  const url = prompt('URL ảnh:');
                  if (url) editor?.chain().focus().setImage({ src: url }).run();
                }, title:'Ảnh' },
                { label:'▶YT', action:() => {
                  const url = prompt('Link YouTube:');
                  if (url) editor?.chain().focus().setYoutubeVideo({ src: url }).run();
                }, title:'Video YouTube' },
              ].map(btn => (
                <button key={btn.label} type="button" onClick={btn.action} title={btn.title}
                  className="px-2.5 py-1 text-xs font-bold font-sans bg-white border border-gray-200
                    rounded hover:bg-red/5 hover:border-red/30 hover:text-red transition-colors">
                  {btn.label}
                </button>
              ))}
            </div>
            <div className="border border-t-0 border-gray-200 rounded-b-lg min-h-[320px] bg-white">
              <EditorContent editor={editor} className="article-body px-4 py-3" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Thumbnail */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="admin-label">Ảnh đại diện</label>
            {thumbnailUrl && (
              <div className="mb-3 rounded-lg overflow-hidden aspect-video">
                <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center
                hover:border-red/40 hover:bg-red/5 transition-colors">
                <div className="text-2xl mb-1">{uploading ? '⏳' : '📷'}</div>
                <p className="text-xs text-gray-500 font-sans">
                  {uploading ? 'Đang upload...' : 'Click để chọn ảnh'}
                </p>
              </div>
            </label>
            {thumbnailUrl && (
              <button onClick={() => setThumbnailUrl('')}
                className="mt-2 text-xs text-red font-sans hover:underline w-full text-center">
                Xóa ảnh
              </button>
            )}
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="admin-label">Chuyên mục</label>
            <select value={form.category_id} onChange={e => set('category_id', e.target.value)}
              className="admin-input">
              <option value="">— Chọn chuyên mục —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="admin-label">Tác giả</label>
            <input value={form.author_name} onChange={e => set('author_name', e.target.value)}
              className="admin-input" />
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="admin-label">Tags (cách nhau bằng dấu phẩy)</label>
            <input value={form.tags} onChange={e => set('tags', e.target.value)}
              placeholder="lịch sử, văn hóa, lễ hội"
              className="admin-input" />
          </div>

          {/* Options */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <label className="admin-label">Tùy chọn</label>
            {[
              { key:'is_featured', label:'⭐ Bài nổi bật' },
              { key:'is_published', label:'✅ Đăng công khai ngay' },
            ].map(opt => (
              <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={(form as any)[opt.key]}
                  onChange={e => set(opt.key, e.target.checked)}
                  className="w-4 h-4 accent-red rounded" />
                <span className="text-sm font-sans text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Global styles for admin inputs */}
      <style jsx global>{`
        .admin-label { display:block; font-size:11px; font-weight:700; font-family:sans-serif;
          text-transform:uppercase; letter-spacing:.8px; color:#6B7280; margin-bottom:6px; }
        .admin-input { display:block; width:100%; border:1px solid #E5E7EB; border-radius:8px;
          padding:10px 14px; font-family:sans-serif; font-size:14px; outline:none;
          transition:border-color .15s; background:#fff; }
        .admin-input:focus { border-color:#B91C1C; }
        select.admin-input { cursor:pointer; }
      `}</style>
    </div>
  );
}