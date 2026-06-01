'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

const FIELDS = [
  { key:'site_name',        label:'Tên website',          type:'text',  placeholder:'Xóm Ngọc Điền' },
  { key:'site_tagline',     label:'Slogan / Tagline',     type:'text',  placeholder:'Văn hóa – Lịch sử – Cộng đồng' },
  { key:'contact_email',    label:'Email liên hệ',        type:'email', placeholder:'tinnhanhonline247@gmail.com' },
  { key:'contact_phone',    label:'Số điện thoại',        type:'text',  placeholder:'0914 58 75 75' },
  { key:'zalo_link',        label:'Link nhóm Zalo',       type:'url',   placeholder:'https://zalo.me/g/...' },
  { key:'facebook_link',    label:'Link Facebook Page',   type:'url',   placeholder:'https://facebook.com/...' },
  { key:'weather_location', label:'Tên địa điểm thời tiết', type:'text', placeholder:'Hưng Nguyên, Nghệ An' },
  { key:'google_analytics', label:'Google Analytics ID',  type:'text',  placeholder:'G-XXXXXXXXXX' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string,string>>({});
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase.from('settings').select('key, value');
      if (data) {
        setSettings(
          Object.fromEntries(
            (data as Array<{ key: string; value: string | null }>).map((r) => [r.key, r.value ?? ''])
          )
        );
      }
    };
    void loadSettings();
  }, []);

  const set = (k: string, v: string) => setSettings(s => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true); setSaved(false);
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase.from('settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
    );
    await Promise.all(updates);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-[680px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-black">⚙️ Cài đặt website</h1>
          <p className="text-sm text-gray-500 font-sans mt-0.5">Thông tin chung và cấu hình hệ thống</p>
        </div>
        <button onClick={save} disabled={saving}
          className="btn-primary disabled:opacity-60">
          {saving ? '⏳ Đang lưu...' : saved ? '✅ Đã lưu!' : '💾 Lưu cài đặt'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {FIELDS.map(f => (
          <div key={f.key} className="px-6 py-4">
            <label className="block text-xs font-bold font-sans uppercase tracking-wider text-gray-500 mb-1.5">
              {f.label}
            </label>
            <input type={f.type} value={settings[f.key] ?? ''}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-sans text-sm
                outline-none focus:border-red transition-colors" />
          </div>
        ))}
      </div>

      {/* Change password */}
      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-5">
        <h3 className="font-display font-bold text-base text-orange-800 mb-2">🔐 Đổi mật khẩu admin</h3>
        <p className="text-xs text-orange-600 font-sans mb-3">
          Để đổi mật khẩu, vào Supabase Dashboard → Authentication → Users → Chọn email admin → Reset password.
        </p>
        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener"
          className="inline-block text-xs font-bold font-sans text-orange-700 underline">
          Mở Supabase Dashboard ↗
        </a>
      </div>

      {/* Info box */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-display font-bold text-base text-blue-800 mb-2">ℹ️ Thông tin hệ thống</h3>
        <div className="space-y-1.5 text-xs text-blue-700 font-sans">
          <p>🌐 Domain: <strong>ngocdien.info.vn</strong></p>
          <p>⚙️ Backend: <strong>Supabase</strong></p>
          <p>🚀 Hosting: <strong>Vercel</strong></p>
          <p>📦 Framework: <strong>Next.js 14 (App Router)</strong></p>
          <p>⚡ Phát triển bởi: <strong>Thái Lão</strong> – tinnhanhonline247@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
