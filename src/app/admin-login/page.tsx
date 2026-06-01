'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@ngocdien.info.vn');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get('error');

    if (urlError === 'not-admin') {
      setError(
        'Tài khoản đã đăng nhập được, nhưng chưa có quyền quản trị. Cần thêm tài khoản này vào bảng admin_profiles với role super_admin hoặc editor.'
      );
    }
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (err) {
      const msg = err.message?.toLowerCase() || '';

      if (msg.includes('invalid login credentials')) {
        setError(
          'Không đăng nhập được: email hoặc mật khẩu không đúng trong Supabase Auth. Anh kiểm tra lại tại Supabase → Authentication → Users.'
        );
      } else if (msg.includes('email not confirmed')) {
        setError(
          'Tài khoản chưa xác nhận email. Anh vào Supabase → Authentication → Users để xác nhận hoặc tạo lại tài khoản admin.'
        );
      } else {
        setError(`Lỗi đăng nhập: ${err.message}`);
      }

      return;
    }

    if (!data.user) {
      setError('Đăng nhập chưa thành công: không lấy được thông tin người dùng.');
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9B1B14] to-[#B91C1C] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#1C1C1C] px-8 py-6 text-center">
          <div className="font-display text-2xl font-black text-white tracking-widest">
            NGỌC ĐIỀN
          </div>
          <div className="text-gold text-[10px] tracking-[4px] font-sans mt-1">
            QUẢN TRỊ HỆ THỐNG
          </div>
        </div>

        <form onSubmit={login} className="px-8 py-7 space-y-4">
          <h2 className="font-display text-xl font-bold text-center mb-5">
            Đăng nhập
          </h2>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold font-sans text-gray-500 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-sans text-sm outline-none focus:border-red transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-sans text-gray-500 uppercase tracking-wider mb-1.5">
              Mật khẩu
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-11 font-sans text-sm outline-none focus:border-red transition-colors"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red text-white font-sans font-bold py-3 rounded-lg hover:bg-red-dark transition-colors disabled:opacity-60 mt-2"
          >
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