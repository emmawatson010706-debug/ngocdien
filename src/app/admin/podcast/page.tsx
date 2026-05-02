'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { formatDuration } from '@/lib/utils';
import type { Podcast } from '@/types/database';

const EMPTY = {
  title:'', description:'', audio_url:'', cover_url:null,
  duration_sec:null, episode_no:null, is_published:false,
};

export default function AdminPodcastPage() {
  const [list, setList]         = useState<Podcast[]>([]);
  const [form, setForm]         = useState<any>(EMPTY);
  const [editing, setEditing]   = useState<string|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingAudio, setUA] = useState(false);
  const [uploadingCover, setUC] = useState(false);
  const [saving, setSaving]     = useState(false);

  const load = async () => {
    const { data } = await supabase.from('podcasts')
      .select('*').order('episode_no', { ascending: false });
    setList((data ?? []) as Podcast[]);
  };

  useEffect(() => { load(); }, []);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const uploadFile = async (file: File, bucket: 'podcasts'|'media', isAudio: boolean) => {
    isAudio ? setUA(true) : setUC(true);
    const path = `${isAudio ? 'audio' : 'covers'}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert:true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
      set(isAudio ? 'audio_url' : 'cover_url', publicUrl);
    }
    isAudio ? setUA(false) : setUC(false);
  };

  const save = async () => {
    if (!form.title || !form.audio_url) return alert('Cần tiêu đề và file audio');
    setSaving(true);
    const payload = {
      ...form,
      episode_no:  form.episode_no  ? +form.episode_no  : null,
      duration_sec:form.duration_sec ? +form.duration_sec : null,
      published_at:form.is_published ? new Date().toISOString() : null,
    };
    if (editing) {
      await supabase.from('podcasts').update(payload).eq('id', editing);
    } else {
      await supabase.from('podcasts').insert([payload]);
    }
    setSaving(false); setShowForm(false); setEditing(null); setForm(EMPTY); load();
  };

  const del = async (id: string) => {
    if (!confirm('Xóa podcast này?')) return;
    await supabase.from('podcasts').delete().eq('id', id);
    load();
  };

  const edit = (p: Podcast) => { setForm({...p}); setEditing(p.id); setShowForm(true); };

  const togglePublish = async (p: Podcast) => {
    await supabase.from('podcasts').update({
      is_published: !p.is_published,
      published_at: !p.is_published ? new Date().toISOString() : null,
    }).eq('id', p.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-black">🎙 Podcast</h1>
          <p className="text-sm text-gray-500 font-sans mt-0.5">{list.length} tập</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}
          className="btn-primary">+ Thêm tập mới</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-display font-bold text-lg mb-5">
            {editing ? 'Sửa podcast' : 'Thêm tập mới'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="Tiêu đề *" value={form.title} onChange={v=>set('title',v)} placeholder="Câu chuyện Mẹ Việt Nam Anh hùng" />
            <F label="Số tập" value={form.episode_no??''} onChange={v=>set('episode_no',v)} type="number" placeholder="1" />

            {/* Audio upload */}
            <div className="sm:col-span-2">
              <label className="admin-label">File Audio (MP3) *</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <input type="file" accept="audio/mp3,audio/mpeg,audio/*" className="hidden"
                    onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0],'podcasts',true)} />
                  <span className="btn-outline text-sm py-2 px-4 inline-block">
                    {uploadingAudio ? '⏳ Uploading...' : '🎵 Chọn file MP3'}
                  </span>
                </label>
                {form.audio_url && (
                  <div className="flex-1">
                    <audio controls src={form.audio_url} className="w-full h-9" />
                  </div>
                )}
              </div>
              {form.audio_url && (
                <p className="text-xs text-green-600 font-sans mt-1">✅ File đã upload thành công</p>
              )}
            </div>

            {/* Cover upload */}
            <div>
              <label className="admin-label">Ảnh bìa (tùy chọn)</label>
              <div className="flex items-center gap-3">
                {form.cover_url && (
                  <img src={form.cover_url} alt="" className="w-14 h-14 rounded-lg object-cover border" />
                )}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0],'media',false)} />
                  <span className="btn-outline text-xs py-1.5 px-3 inline-block">
                    {uploadingCover ? '⏳...' : '📷 Chọn ảnh bìa'}
                  </span>
                </label>
              </div>
            </div>

            <F label="Thời lượng (giây)" value={form.duration_sec??''} onChange={v=>set('duration_sec',v)} type="number" placeholder="1440" />

            <div className="sm:col-span-2">
              <label className="admin-label">Mô tả</label>
              <textarea value={form.description??''} onChange={e=>set('description',e.target.value)}
                rows={2} className="admin-input resize-none"
                placeholder="Nội dung tóm tắt của tập podcast..." />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_published}
                  onChange={e=>set('is_published',e.target.checked)}
                  className="w-4 h-4 accent-red" />
                <span className="text-sm font-sans text-gray-700">✅ Xuất bản ngay</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? '⏳ Lưu...' : '💾 Lưu podcast'}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn-outline">Hủy</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm font-sans">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Tập','Tiêu đề','Thời lượng','Trạng thái',''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-bold text-gray-500">#{p.episode_no ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.cover_url
                      ? <img src={p.cover_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      : <div className="w-10 h-10 rounded-lg bg-[#1C1C1C] flex items-center justify-center text-lg">🎙</div>}
                    <div>
                      <p className="font-semibold text-ink">{p.title}</p>
                      {p.description && <p className="text-xs text-gray-400 line-clamp-1">{p.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {p.duration_sec ? formatDuration(p.duration_sec) : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full
                    ${p.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_published ? '✅ Đã xuất bản' : '📋 Nháp'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => edit(p)} className="text-xs font-bold text-blue-600 hover:underline">Sửa</button>
                    <button onClick={() => togglePublish(p)} className="text-xs font-bold text-orange-500 hover:underline">
                      {p.is_published ? 'Ẩn' : 'Xuất bản'}
                    </button>
                    <button onClick={() => del(p.id)} className="text-xs font-bold text-red hover:underline">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                Chưa có podcast nào.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx global>{`
        .admin-label{display:block;font-size:11px;font-weight:700;font-family:sans-serif;
          text-transform:uppercase;letter-spacing:.8px;color:#6B7280;margin-bottom:6px}
        .admin-input{display:block;width:100%;border:1px solid #E5E7EB;border-radius:8px;
          padding:10px 14px;font-family:sans-serif;font-size:14px;outline:none;
          transition:border-color .15s;background:#fff}
        .admin-input:focus{border-color:#B91C1C}
      `}</style>
    </div>
  );
}

function F({ label, value, onChange, placeholder, type='text' }: {
  label:string; value:any; onChange:(v:string)=>void; placeholder?:string; type?:string;
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder} className="admin-input" />
    </div>
  );
}
