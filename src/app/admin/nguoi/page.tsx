'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Person, PersonType } from '@/types/database';

const TABS: { value: PersonType; label: string; icon: string; color: string }[] = [
  { value:'me_vnah',   label:'Mẹ Việt Nam Anh hùng', icon:'🌺', color:'#B91C1C' },
  { value:'liet_sy',   label:'Liệt sỹ',               icon:'🕯', color:'#1C1C1C' },
  { value:'anh_hung',  label:'Anh hùng lao động',     icon:'🏅', color:'#065F46' },
  { value:'dang_vien', label:'Đảng viên đầu tiên',    icon:'⭐', color:'#1D4ED8' },
];

const EMPTY: Omit<Person,'id'|'created_at'> = {
  full_name:'', type:'liet_sy', image_url:null,
  birth_year:null, death_year:null, hometown:null, biography:null, sort_order:0,
};

export default function AdminNguoiPage() {
  const [tab, setTab]         = useState<PersonType>('me_vnah');
  const [people, setPeople]   = useState<Person[]>([]);
  const [form, setForm]       = useState<any>({ ...EMPTY, type: tab });
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]   = useState(false);

  const load = async () => {
    const { data } = await supabase.from('people')
      .select('*').eq('type', tab).order('sort_order');
    setPeople((data ?? []) as Person[]);
  };

  useEffect(() => { load(); setShowForm(false); }, [tab]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const uploadImage = async (file: File) => {
    setUploading(true);
    const path = `people/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert:true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
      set('image_url', publicUrl);
    }
    setUploading(false);
  };

  const save = async () => {
    if (!form.full_name.trim()) return alert('Vui lòng nhập họ tên');
    setSaving(true);
    const payload = { ...form, type: tab,
      birth_year: form.birth_year ? +form.birth_year : null,
      death_year: form.death_year ? +form.death_year : null,
    };
    if (editing) {
      await supabase.from('people').update(payload).eq('id', editing);
    } else {
      await supabase.from('people').insert([payload]);
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm({ ...EMPTY, type: tab });
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Xóa người này?')) return;
    await supabase.from('people').delete().eq('id', id);
    load();
  };

  const edit = (p: Person) => {
    setForm({ ...p });
    setEditing(p.id);
    setShowForm(true);
  };

  const currentTab = TABS.find(t => t.value === tab)!;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-black">Người Ngọc Điền</h1>
        <button onClick={() => { setForm({ ...EMPTY, type:tab }); setEditing(null); setShowForm(true); }}
          className="btn-primary">+ Thêm mới</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans font-bold
              border-2 transition-all ${tab === t.value
                ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-600'}`}
            style={tab === t.value ? { background: t.color, borderColor: t.color } : {}}>
            {t.icon} {t.label}
            <span className="text-[11px] opacity-75">({tab === t.value ? people.length : '?'})</span>
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-display font-bold text-lg mb-4">
            {editing ? 'Sửa thông tin' : `Thêm ${currentTab.label}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Image */}
            <div className="sm:col-span-2 flex items-center gap-5">
              <div className="w-20 h-24 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                {form.image_url
                  ? <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                  : <span className="text-3xl">{currentTab.icon}</span>}
              </div>
              <div>
                <label className="cursor-pointer inline-block">
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                  <span className="btn-outline text-xs py-1.5 px-3">
                    {uploading ? '⏳ Uploading...' : '📷 Chọn ảnh'}
                  </span>
                </label>
                <p className="text-xs text-gray-400 font-sans mt-1.5">Ảnh chân dung, tỷ lệ 4:5</p>
              </div>
            </div>

            <F label="Họ và tên *" value={form.full_name} onChange={v => set('full_name', v)} placeholder="Nguyễn Thị Hoa" />
            <F label="Quê quán" value={form.hometown ?? ''} onChange={v => set('hometown', v)} placeholder="Xóm Ngọc Điền, Hưng Nguyên" />
            <F label="Năm sinh" value={form.birth_year ?? ''} onChange={v => set('birth_year', v)} type="number" placeholder="1920" />
            <F label="Năm mất" value={form.death_year ?? ''} onChange={v => set('death_year', v)} type="number" placeholder="1975" />
            <F label="Thứ tự hiển thị" value={form.sort_order} onChange={v => set('sort_order', +v)} type="number" placeholder="0" />

            <div className="sm:col-span-2">
              <label className="admin-label">Tiểu sử / Ghi chú</label>
              <textarea value={form.biography ?? ''} onChange={e => set('biography', e.target.value)}
                rows={3} placeholder="Tóm tắt tiểu sử, thành tích, quá trình..."
                className="admin-input resize-none" />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? '⏳ Lưu...' : '💾 Lưu'}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn-outline">Hủy</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {people.map(p => (
          <div key={p.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm
            hover:shadow-md transition-shadow">
            <div className="aspect-[4/5] overflow-hidden bg-gray-100">
              {p.image_url
                ? <img src={p.image_url} alt={p.full_name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-4xl">{currentTab.icon}</div>}
            </div>
            <div className="p-3">
              <p className="font-sans font-bold text-sm text-ink leading-snug">{p.full_name}</p>
              {(p.birth_year || p.death_year) && (
                <p className="text-xs text-gray-400 font-sans mt-0.5">
                  {p.birth_year ?? '?'} – {p.death_year ?? '?'}
                </p>
              )}
              {p.hometown && <p className="text-xs text-gray-400 font-sans">{p.hometown}</p>}
              <div className="flex gap-2 mt-2.5">
                <button onClick={() => edit(p)} className="text-xs font-bold text-blue-600 hover:underline font-sans">Sửa</button>
                <button onClick={() => del(p.id)} className="text-xs font-bold text-red hover:underline font-sans">Xóa</button>
              </div>
            </div>
          </div>
        ))}
        {!people.length && !showForm && (
          <div className="col-span-full py-12 text-center text-gray-400 font-sans text-sm border border-dashed border-gray-200 rounded-xl">
            Chưa có {currentTab.label} nào. Nhấn <strong>+ Thêm mới</strong> để bắt đầu.
          </div>
        )}
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
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} className="admin-input" />
    </div>
  );
}
