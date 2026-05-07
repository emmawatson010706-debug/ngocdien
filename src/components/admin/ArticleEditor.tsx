'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Node, mergeAttributes } from '@tiptap/core'; // Phục vụ cho bộ phát Podcast

import { supabase } from '@/lib/supabase/client';
import { toSlug } from '@/lib/utils';
import type { Article } from '@/types/database';

// 🚀 PHỤ TÙNG ĐỘC QUYỀN: BỘ PHÁT PODCAST (MP3)
const AudioPlayer = Node.create({
  name: 'audioPlayer',
  group: 'block',
  atom: true,
  addAttributes() { return { src: { default: null } }; },
  parseHTML() { return [{ tag: 'audio' }]; },
  renderHTML({ HTMLAttributes }) {
    return ['audio', mergeAttributes(HTMLAttributes, { controls: 'true', style: 'width: 100%; border-radius: 8px; margin: 16px 0; outline: none;' })];
  },
});

// 🔥 ĐÃ BỔ SUNG MỤC "GIỚI THIỆU" SAU MỤC "TIN TỨC"
const ALL_CATEGORIES = [
  { id: 'tin-tuc', name: '🚩 TIN TỨC (Mục lớn)', isParent: true },
  { id: 'gioi-thieu', name: 'ℹ️ GIỚI THIỆU (Mục lớn)', isParent: true }, 
  { id: 'thong-bao', name: '—— Thông báo' },
  { id: 'su-kien', name: '—— Sự kiện' },

  { id: 'nguoi-ngoc-dien', name: '👥 NGƯỜI NGỌC ĐIỀN (Mục lớn)', isParent: true },
  { id: 'nguoi-ngoc-dien-chung', name: '—— Giới thiệu chung' },
  { id: 'me-vnah', name: '—— Mẹ Việt Nam Anh hùng' },
  { id: 'liet-sy', name: '—— Liệt sỹ' },
  { id: 'anh-hung', name: '—— Anh hùng LĐ Cao Lục' },
  { id: 'dang-vien', name: '—— Đảng viên đầu tiên' },

  { id: 'lich-su', name: '📜 LỊCH SỬ', isParent: true },

  { id: 'tieng-lang', name: '✍️ TIẾNG LÀNG (Mục lớn)', isParent: true },
  { id: 'tan-van', name: '—— Tản văn' },
  { id: 'tho', name: '—— Thơ' },
  { id: 'kham-pha', name: '—— Khám phá' },
  { id: 'goc-nhin-thang', name: '—— Góc nhìn thẳng' },
  { id: 'podcast', name: '—— Podcast' },

  { id: 'di-tich', name: '🏛️ DI TÍCH (Mục lớn)', isParent: true },
  { id: 'den', name: '—— Đền Ngọc Điền' },
  { id: 'gieng', name: '—— Giếng làng' },

  { id: 'le-hoi', name: '🎊 LỄ HỘI (Mục lớn)', isParent: true },
  { id: 'le-hoi-den', name: '—— Lễ hội Đền' },
  { id: 'le-hoi-xom', name: '—— Lễ hội Xóm' },
  { id: 'le-hoi-gieng', name: '—— Lễ hội Giếng' },

  { id: 'thu-vien', name: '📚 THƯ VIỆN (Mục lớn)', isParent: true },
  { id: 'huong-uoc', name: '—— Hương ước 1883' },
  { id: 'dang-bo', name: '—— Lịch sử Đảng bộ' }
];

interface Props { article?: Article; categories?: any; }

export default function ArticleEditor({ article }: Props) {
  const router = useRouter();
  const isEdit = !!article;
  const mediaInputRef = useRef<HTMLInputElement>(null); // Trình gọi file ẩn

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [form, setForm] = useState({
    title:       article?.title ?? '',
    slug:        article?.slug ?? '',
    excerpt:     article?.excerpt ?? '',
    category_id: (article as any)?.cat ?? (article as any)?.category_id ?? '',
    author_name: article?.author_name ?? 'Ban biên tập',
    tags:        article?.tags?.join(', ') ?? '',
    is_featured: article?.is_featured ?? false,
    is_published:article?.is_published ?? false,
  });

  const [thumbnailUrl, setThumbnailUrl] = useState((article as any)?.img ?? article?.thumbnail_url ?? '');
  const [uploading, setUploading]       = useState(false);
  const [editorUploading, setEditorUploading] = useState(false);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit, Image, Link.configure({ openOnClick: false }), Youtube.configure({ controls: true }),
      TextStyle, Color, TextAlign.configure({ types: ['heading', 'paragraph'] }), AudioPlayer
    ],
    content: article?.content ?? '<p>Bắt đầu viết nội dung bài...</p>',
    immediatelyRender: false, 
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const autoSlug = (title: string) => { if (!isEdit) set('slug', toSlug(title)); };

  // UPLOAD ẢNH ĐẠI DIỆN
  const uploadThumbnail = async (file: File) => {
    setUploading(true);
    const ext  = file.name.split('.').pop();
    const path = `articles/thumb_${Date.now()}.${ext}`;
    const { error: err } = await supabase.storage.from('media').upload(path, file, { upsert: true });
    setUploading(false);
    if (err) { alert('Lỗi upload: ' + err.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
    setThumbnailUrl(publicUrl);
  };

  // 🚀 UPLOAD TRỰC TIẾP ẢNH / MP3 VÀO TRONG BÀI VIẾT
  const handleEditorMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const isAudio = file.type.startsWith('audio/');
    setEditorUploading(true);
    
    const ext = file.name.split('.').pop();
    const path = `editor/${isAudio ? 'audio' : 'img'}_${Date.now()}.${ext}`;
    
    const { error: err } = await supabase.storage.from('media').upload(path, file);
    setEditorUploading(false);
    
    if (err) { alert('Lỗi tải file: ' + err.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);

    if (isAudio) {
      editor?.chain().focus().insertContent(`<audio controls src="${publicUrl}"></audio><p></p>`).run();
    } else {
      editor?.chain().focus().setImage({ src: publicUrl }).run();
    }
  };

  const save = async (publish?: boolean) => {
    if (!form.title.trim()) { setError('Vui lòng nhập tiêu đề'); return; }
    if (!form.category_id) { setError('Vui lòng chọn 1 chuyên mục!'); return; }
    setSaving(true); setError('');

    const payload = {
      title:   form.title, slug: form.slug || toSlug(form.title), cat: form.category_id, 
      date:    new Date().toLocaleDateString('vi-VN'), img: thumbnailUrl || '', excerpt: form.excerpt || '',
      content: editor?.getHTML() ?? '',
    };

    const { error: err } = isEdit
      ? await supabase.from('articles').update(payload).eq('id', article!.id)
      : await supabase.from('articles').insert([payload]);

    setSaving(false);
    if (err) { setError('Lỗi lưu bài: ' + err.message); return; }

    alert('🎉 LƯU BÀI THÀNH CÔNG!');
    router.push('/admin/bai-viet');
    router.refresh();
  };

  if (!mounted) return <div className="flex justify-center items-center min-h-[400px]"><p className="text-[#B91C1C] font-bold text-lg animate-pulse">⏳ Đang tải bộ máy...</p></div>;

  return (
    <div className="max-w-[920px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-black">{isEdit ? '✏️ Sửa bài viết' : '✏️ Tạo bài viết mới'}</h1>
        <div className="flex gap-2">
          <button onClick={() => save(false)} disabled={saving} className="btn-outline text-sm py-2">💾 Lưu nháp</button>
          <button onClick={() => save(true)} disabled={saving} className="btn-primary text-sm py-2">🚀 {saving ? 'Đang lưu...' : 'Lưu & Đăng'}</button>
        </div>
      </div>

      {error && <div className="bg-red/10 border border-red/30 text-red text-sm font-sans rounded-lg px-4 py-3 mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <div className="space-y-4">
          <div>
            <label className="admin-label">Tiêu đề *</label>
            <input value={form.title} onChange={e => { set('title', e.target.value); autoSlug(e.target.value); }} className="admin-input text-lg font-serif font-bold" />
          </div>
          <div>
            <label className="admin-label">Đường dẫn (slug)</label>
            <div className="flex">
              <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg px-3 py-2.5 text-xs text-gray-400">/bai-viet/</span>
              <input value={form.slug} onChange={e => set('slug', e.target.value)} className="admin-input rounded-l-none flex-1" />
            </div>
          </div>
          <div>
            <label className="admin-label">Mô tả ngắn (tóm tắt)</label>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} className="admin-input resize-none" />
          </div>

          <div>
            <label className="admin-label">Nội dung bài viết * {editorUploading && <span className="text-red-600 animate-pulse">(Đang tải file lên...)</span>}</label>
            
            {/* THẺ INPUT ẨN ĐỂ CHỌN FILE */}
            <input type="file" ref={mediaInputRef} accept="image/*,audio/*" className="hidden" onChange={handleEditorMediaUpload} />

            <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg">
              {[
                { label:'B', action:() => editor?.chain().focus().toggleBold().run() },
                { label:'I', action:() => editor?.chain().focus().toggleItalic().run() },
                { label:'H2', action:() => editor?.chain().focus().toggleHeading({ level:2 }).run() },
                { label:'H3', action:() => editor?.chain().focus().toggleHeading({ level:3 }).run() },
                { label:'•', action:() => editor?.chain().focus().toggleBulletList().run() },
                { label:'1.', action:() => editor?.chain().focus().toggleOrderedList().run() },
                { label:'❝', action:() => editor?.chain().focus().toggleBlockquote().run() },
                { label:'⫷', action:() => editor?.chain().focus().setTextAlign('left').run() },
                { label:'≑', action:() => editor?.chain().focus().setTextAlign('center').run() },
              ].map(btn => (
                <button key={btn.label} type="button" onClick={btn.action} className="px-2.5 py-1 text-xs font-bold font-sans bg-white border border-gray-200 rounded hover:text-red transition-colors">{btn.label}</button>
              ))}

              {/* NÚT TẢI ẢNH VÀ MP3 CHUYÊN NGHIỆP */}
              <button type="button" onClick={() => { mediaInputRef.current?.setAttribute('accept', 'image/*'); mediaInputRef.current?.click(); }} 
                className="px-2.5 py-1 text-xs font-bold bg-[#E8F0FE] text-[#1967D2] border border-[#1967D2]/30 rounded hover:bg-[#D2E3FC]">🖼 Tải Ảnh</button>
              
              <button type="button" onClick={() => { mediaInputRef.current?.setAttribute('accept', 'audio/*'); mediaInputRef.current?.click(); }} 
                className="px-2.5 py-1 text-xs font-bold bg-[#FCE8E6] text-[#C5221F] border border-[#C5221F]/30 rounded hover:bg-[#FAD2CF]">🎵 Tải Podcast (MP3)</button>

              <button type="button" onClick={() => { const url = prompt('Link YouTube:'); if (url) editor?.chain().focus().setYoutubeVideo({ src: url }).run(); }} 
                className="px-2.5 py-1 text-xs font-bold bg-white border border-gray-200 rounded hover:text-red">▶YT</button>

              <input type="color" onChange={e => editor?.chain().focus().setColor(e.target.value).run()} value={editor?.getAttributes('textStyle').color || '#000000'} className="w-7 h-7 p-0 ml-1 border-0 cursor-pointer bg-transparent" />
            </div>
            <div className="border border-t-0 border-gray-200 rounded-b-lg min-h-[320px] bg-white">
              <EditorContent editor={editor} className="article-body px-4 py-3" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="admin-label mb-3">Ảnh đại diện</label>
            {thumbnailUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img src={thumbnailUrl} className="w-full h-auto aspect-video object-cover" />
                <button type="button" onClick={() => setThumbnailUrl('')} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full font-bold shadow-md z-10" style={{ backgroundColor: '#dc2626' }}>✕</button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadThumbnail(e.target.files[0])} />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#B91C1C]/50 transition-all">
                  <div className="text-3xl mb-2">{uploading ? '⏳' : '📷'}</div>
                  <p className="text-sm text-gray-500 font-sans">{uploading ? 'Đang tải...' : 'Click chọn ảnh'}</p>
                </div>
              </label>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="admin-label">Chuyên mục *</label>
            <select value={form.category_id} onChange={e => set('category_id', e.target.value)} className="admin-input">
              <option value="">— Mời chọn chuyên mục —</option>
              {ALL_CATEGORIES.map(c => (
                <option key={c.id} value={c.id} style={{ fontWeight: c.isParent ? 'bold' : 'normal', color: c.isParent ? '#B91C1C' : '#000', backgroundColor: c.isParent ? '#FFF5F5' : '#FFF' }}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="admin-label">Tác giả</label>
            <input value={form.author_name} onChange={e => set('author_name', e.target.value)} className="admin-input" />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <label className="admin-label">Tùy chọn</label>
            {[{ key:'is_featured', label:'⭐ Bài nổi bật' }, { key:'is_published', label:'✅ Đăng công khai ngay' }].map(opt => (
              <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={(form as any)[opt.key]} onChange={e => set(opt.key, e.target.checked)} className="w-4 h-4 accent-red rounded" />
                <span className="text-sm font-sans text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`.admin-label { display:block; font-size:11px; font-weight:700; font-family:sans-serif; text-transform:uppercase; letter-spacing:.8px; color:#6B7280; margin-bottom:6px; } .admin-input { display:block; width:100%; border:1px solid #E5E7EB; border-radius:8px; padding:10px 14px; font-family:sans-serif; font-size:14px; outline:none; transition:border-color .15s; background:#fff; } .admin-input:focus { border-color:#B91C1C; }`}</style>
    </div>
  );
}