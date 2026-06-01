'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router  = useRouter();
  const [email, setEmail]       = useState('admin@ngocdien.info.vn');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message === 'Invalid login credentials' ? 'Sai email hoặc mật khẩu' : err.message); return; }
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9B1B14] to-[#B91C1C] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#1C1C1C] px-8 py-6 text-center">
          <div className="font-display text-2xl font-black text-white tracking-widest">NGỌC ĐIỀN</div>
          <div className="text-gold text-[10px] tracking-[4px] font-sans mt-1">QUẢN TRỊ HỆ THỐNG</div>
        </div>

        <form onSubmit={login} className="px-8 py-7 space-y-4">
          <h2 className="font-display text-xl font-bold text-center mb-5">Đăng nhập</h2>

          <div>
            <label className="block text-xs font-bold font-sans text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-sans text-sm
                outline-none focus:border-red transition-colors"
              required />
          </div>

          <div>
            <label className="block text-xs font-bold font-sans text-gray-500 uppercase tracking-wider mb-1.5">Mật khẩu</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-sans text-sm
                outline-none focus:border-red transition-colors"
              required />
          </div>

          {error && <p className="text-red text-sm font-sans text-center">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-red text-white font-sans font-bold py-3 rounded-lg
              hover:bg-red-dark transition-colors disabled:opacity-60 mt-2">
            {loading ? '⏳ Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 font-sans pb-6">
          ⚡ Phát triển bởi Thái Lão
        </p>
      </div>
    </div>
  );
}
