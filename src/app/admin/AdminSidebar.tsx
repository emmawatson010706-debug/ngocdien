'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Đã loại bỏ mục Góp ý khỏi danh sách MENU
const MENU = [
  { label: 'Tổng quan',    href: '/admin',                icon: '📊' },
  { label: 'Bài viết',     href: '/admin/bai-viet',       icon: '📝' },
  
  { label: 'Cài đặt',      href: '/admin/cai-dat',        icon: '⚙️' },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setOpen(o => !o)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#1C1C1C] text-white p-2.5 rounded-lg shadow-lg">
        ☰
      </button>

      {open && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />}

      <aside className={`w-60 bg-[#1C1C1C] text-white flex flex-col shrink-0
        fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="block">
            <div className="font-display text-lg font-black tracking-widest text-white">NGỌC ĐIỀN</div>
            <div className="text-[10px] text-gold font-sans tracking-widest mt-0.5">QUẢN TRỊ HỆ THỐNG</div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {MENU.map(item => {
            const active = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 text-[13.5px] font-sans font-semibold
                  transition-colors ${active
                    ? 'bg-red text-white'
                    : 'text-gray-300 hover:bg-white/8 hover:text-white'}`}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-5 py-4 border-t border-white/10">
          <div className="text-[11px] text-gray-400 font-sans truncate mb-3">{email}</div>
          <button onClick={logout}
            className="w-full bg-white/8 hover:bg-red text-white text-xs font-sans font-bold
              py-2 rounded transition-colors">
            🚪 Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}