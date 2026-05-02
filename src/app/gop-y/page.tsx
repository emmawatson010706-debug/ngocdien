'use client';
import { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { supabase } from '@/lib/supabase/client';

const TYPES = [
  { value:'gop_y',    label:'💡 Góp ý',           color:'#0891B2' },
  { value:'phan_anh', label:'📣 Phản ánh',          color:'#DC2626' },
  { value:'kien_nghi',label:'📋 Kiến nghị',         color:'#7C3AED' },
  { value:'gui_bai',  label:'📝 Gửi bài viết',      color:'#B45309' },
];

export default function GopYPage() {
  const [type, setType]       = useState('gop_y');
  const [form, setForm]       = useState({ name:'', email:'', phone:'', subject:'', content:'' });
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) { setError('Vui lòng nhập nội dung'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.from('submissions').insert([{
      type, sender_name: form.name, email: form.email,
      phone: form.phone, subject: form.subject, content: form.content,
    }]);
    setLoading(false);
    if (err) { setError('Gửi thất bại. Vui lòng thử lại.'); return; }
    setDone(true);
  };

  const selected = TYPES.find(t => t.value === type)!;

  return (
    <PublicLayout>
      <div className="max-w-[760px] mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-black mb-2">✉️ Góp ý & Gửi bài</h1>
        <p className="text-sm text-gray-500 font-sans mb-7">
          Mọi ý kiến đóng góp, phản ánh hoặc bài viết gửi về sẽ được Ban biên tập xem xét trong vòng 3 ngày làm việc.
        </p>

        {done ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h2 className="font-display text-xl font-bold mb-2">Gửi thành công!</h2>
            <p className="text-sm text-gray-500 font-sans">Cảm ơn bạn. Ban biên tập sẽ phản hồi sớm nhất.</p>
            <button onClick={() => { setDone(false); setForm({ name:'',email:'',phone:'',subject:'',content:'' }); }}
              className="btn-primary mt-5">Gửi thêm</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold font-sans uppercase tracking-widest text-gray-500 mb-2">
                Loại yêu cầu *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TYPES.map(t => (
                  <button key={t.value} type="button" onClick={() => setType(t.value)}
                    className="py-2.5 px-3 rounded-lg text-sm font-bold font-sans border-2 transition-all"
                    style={{
                      borderColor: type === t.value ? t.color : '#E8DDD0',
                      background:  type === t.value ? `${t.color}15` : '#fff',
                      color:       type === t.value ? t.color : '#666',
                    }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Họ và tên" value={form.name} onChange={v => set('name', v)} placeholder="Nguyễn Văn A" />
              <Field label="Điện thoại" value={form.phone} onChange={v => set('phone', v)} placeholder="0912 345 678" />
            </div>

            {/* Email + Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email" value={form.email} onChange={v => set('email', v)} placeholder="email@gmail.com" type="email" />
              <Field label="Tiêu đề" value={form.subject} onChange={v => set('subject', v)} placeholder={`Tiêu đề ${selected.label}`} />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-bold font-sans uppercase tracking-widest text-gray-500 mb-1.5">
                Nội dung *
              </label>
              <textarea value={form.content} onChange={e => set('content', e.target.value)}
                rows={7} required
                placeholder={type === 'gui_bai'
                  ? 'Dán nội dung bài viết vào đây (hoặc mô tả ngắn để biên tập liên hệ)...'
                  : 'Trình bày chi tiết nội dung góp ý, phản ánh hoặc kiến nghị của bạn...'}
                className="w-full border border-[#E8DDD0] rounded-lg px-4 py-3 font-sans text-sm
                  outline-none focus:border-red transition-colors resize-none bg-white" />
            </div>

            {error && <p className="text-red text-sm font-sans">{error}</p>}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-60">
              {loading ? '⏳ Đang gửi...' : `${selected.label} →`}
            </button>
          </form>
        )}
      </div>
    </PublicLayout>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold font-sans uppercase tracking-widest text-gray-500 mb-1.5">
        {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 font-sans text-sm
          outline-none focus:border-red transition-colors bg-white" />
    </div>
  );
}
