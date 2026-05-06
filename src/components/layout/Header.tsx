'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV = [
  { label: 'GIỚI THIỆU', href: '/gioi-thieu', icon: '🏡', children: [] },
  { label: 'TIN TỨC', href: '/chuyen-muc/tin-tuc', icon: '📰',
    children: [{ label: 'Thông báo', href: '/chuyen-muc/thong-bao' }, { label: 'Sự kiện', href: '/chuyen-muc/su-kien' }] },
  { label: 'NGƯỜI NGỌC ĐIỀN', href: '/chuyen-muc/nguoi-ngoc-dien', icon: '👥',
    children: [
      { label: 'Giới thiệu chung', href: '/chuyen-muc/nguoi-ngoc-dien-chung' },
      { label: 'Mẹ Việt Nam Anh hùng', href: '/chuyen-muc/me-vnah' },
      { label: 'Liệt sỹ', href: '/chuyen-muc/liet-sy' },
      { label: 'Anh hùng lao động Cao Lục', href: '/chuyen-muc/anh-hung' },
      { label: 'Đảng viên đầu tiên', href: '/chuyen-muc/dang-vien' },
    ]},
  { label: 'LỊCH SỬ', href: '/chuyen-muc/lich-su', icon: '📜', children: [] },
  { label: 'TIẾNG LÀNG', href: '/chuyen-muc/tieng-lang', icon: '✍️',
    children: [
      { label: 'Tản văn', href: '/chuyen-muc/tan-van' },
      { label: 'Tản mạn', href: '/chuyen-muc/tan-man' },
      { label: 'Thơ', href: '/chuyen-muc/tho' },
      { label: 'Khám phá', href: '/chuyen-muc/kham-pha' },
      { label: 'Góc nhìn thẳng', href: '/chuyen-muc/goc-nhin-thang' },
      { label: 'Podcast', href: '/chuyen-muc/podcast' },
    ]},
  { label: 'DI TÍCH', href: '/chuyen-muc/di-tich', icon: '🏛️',
    children: [{ label: 'Đền Ngọc Điền', href: '/chuyen-muc/den' }, { label: 'Giếng làng', href: '/chuyen-muc/gieng' }] },
  { label: 'LỄ HỘI', href: '/chuyen-muc/le-hoi', icon: '🎊',
    children: [
      { label: 'Lễ hội Đền', href: '/chuyen-muc/le-hoi-den' },
      { label: 'Lễ hội Xóm', href: '/chuyen-muc/le-hoi-xom' },
      { label: 'Lễ hội Giếng', href: '/chuyen-muc/le-hoi-gieng' },
    ]},
  { label: 'THƯ VIỆN', href: '/chuyen-muc/thu-vien', icon: '📚',
    children: [{ label: 'Hương ước 1883', href: '/chuyen-muc/huong-uoc' }, { label: 'Lịch sử Đảng bộ', href: '/chuyen-muc/dang-bo' }] },
  { label: 'CHUYỂN ĐỔI SỐ', href: '/chuyen-doi-so', icon: '💻',
    children: [
      { label: 'Dịch vụ công ↗', href: 'https://dichvucong.gov.vn', ext: true },
      { label: 'Hướng dẫn VNeID ↗', href: 'https://vneid.gov.vn', ext: true },
      { label: 'Cổng thông tin ↗', href: 'https://nghean.gov.vn', ext: true },
      { label: 'Bản đồ số', href: '/chuyen-doi-so/ban-do' },
    ]},
  { label: 'GÓP Ý & GỬI BÀI', href: '/gop-y', icon: '✉️',
    children: [
      { label: 'Góp ý', href: '/gop-y?type=gop_y' },
      { label: 'Phản ánh', href: '/gop-y?type=phan_anh' },
      { label: 'Kiến nghị', href: '/gop-y?type=kien_nghi' },
      { label: 'Gửi bài', href: '/gop-y?type=gui_bai' },
    ]},
  { label: 'CỘNG ĐỒNG', href: '/cong-dong', icon: '🤝',
    children: [{ label: 'Zalo', href: '#' }, { label: 'Facebook', href: '#' }] },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [scrolled, setScrolled]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <div className="bg-[#FFF8EE] border-b border-[#EAE0D0] py-2 overflow-x-auto scrollbar-hide">
        <div className="w-max min-w-full max-w-[1180px] mx-auto px-4 flex justify-between items-center gap-6">
          <p className="text-[11px] md:text-xs text-gray-500 font-sans whitespace-nowrap">
            📅 {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="flex gap-4 md:gap-5 items-center whitespace-nowrap">
            <Link href="/gop-y" className="text-[11px] md:text-xs text-[#B91C1C] font-sans font-bold hover:underline">🔔 Gửi bài</Link>
            <Link href="/admin" className="text-[11px] md:text-xs text-gray-500 font-sans hover:text-[#B91C1C]">⚙ Quản trị</Link>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-xl' : 'shadow-md'}`}
        style={{ background: 'linear-gradient(180deg,#9B1B14 0%,#B91C1C 100%)' }}>
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="flex items-center justify-center relative py-3 md:py-4">
            <Link href="/" className="text-center group">
              <div className="font-display text-[clamp(22px,5vw,34px)] font-black text-white tracking-[3px] leading-none drop-shadow-md group-hover:text-yellow-100 transition-colors">NGỌC ĐIỀN</div>
              <div className="text-[#FBBF24] text-[10px] tracking-[5px] font-sans font-light mt-1">VĂN HÓA  ·  LỊCH SỬ  ·  CỘNG ĐỒNG</div>
            </Link>
            <button onClick={() => setMenuOpen(true)} className="absolute right-0 flex flex-col gap-[5px] p-2.5 rounded-md border border-white/20 bg-white/10 lg:hidden shadow-inner">
              {[0,1,2].map(i => <span key={i} className="block w-5 h-0.5 bg-white rounded" />)}
            </button>
          </div>
        </div>

        <div className="relative bg-black/20 border-t border-white/10 hidden lg:block">
          <div className="max-w-[1180px] mx-auto px-4">
            <nav className="flex items-center justify-center space-x-1">
              {NAV.map((item, i) => (
                <div key={i} className="relative group shrink-0">
                  <Link href={item.href} className="text-white/90 hover:text-[#FBBF24] hover:bg-white/10 font-sans font-bold text-[11px] tracking-[.6px] px-4 py-3 block whitespace-nowrap transition-all uppercase">
                    {item.label}
                  </Link>
                  {item.children.length > 0 && (
                    <div className="absolute left-0 top-full hidden group-hover:block min-w-[200px] bg-[#FEF9F2] shadow-2xl border-t-4 border-[#B91C1C] rounded-b-md z-[999] overflow-hidden">
                      {item.children.map((child: any, j) => (
                        <Link key={j} href={child.href} target={child.ext ? '_blank' : undefined}
                          className="block px-5 py-3 text-[13px] font-sans font-bold text-gray-800 hover:bg-[#B91C1C] hover:text-white border-b border-gray-200/60 last:border-0 transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      {menuOpen && <div className="fixed inset-0 bg-black/60 z-[900] lg:hidden" onClick={() => setMenuOpen(false)} />}
      <nav className={`fixed top-0 right-0 h-full w-[300px] max-w-full bg-[#1A1A1A] z-[901] flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-5 bg-[#B91C1C]">
          <div className="font-display text-xl font-black text-white">NGỌC ĐIỀN</div>
          <button onClick={() => setMenuOpen(false)} className="text-white text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#1A1A1A]">
          {NAV.map((item, i) => (
            <div key={i} className="border-b border-white/5">
              <button onClick={() => { setExpanded(expanded === i ? null : i); if (!item.children.length) setMenuOpen(false); }} 
                className="w-full flex justify-between items-center px-5 py-4 text-gray-200 font-sans font-bold text-[12px] uppercase tracking-wider">
                <span>{item.icon} &nbsp;{item.label}</span>
                {item.children.length > 0 && <span className={`transition-transform ${expanded === i ? 'rotate-90' : ''}`}>›</span>}
              </button>
              {expanded === i && item.children.map((child: any, j) => (
                <Link key={j} href={child.href} onClick={() => setMenuOpen(false)} className="block pl-10 pr-5 py-3 text-[#FBBF24] text-[13px] font-sans bg-black/30 hover:bg-white/5">
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="p-5 bg-black/50 text-[11px] font-sans text-gray-400">
           ⚡ Phát triển bởi Thái Lão
        </div>
      </nav>
    </>
  );
}