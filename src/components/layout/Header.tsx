'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV = [
  { label: 'GIỚI THIỆU', href: '/gioi-thieu', icon: '🏡', children: [] },
  { label: 'TIN TỨC', href: '/tin-tuc', icon: '📰',
    children: [{ label: 'Thông báo', href: '/tin-tuc/thong-bao' }, { label: 'Sự kiện', href: '/tin-tuc/su-kien' }] },
  { label: 'TRA CỨU NGƯỜI', href: '/tra-cuu-nguoi-ngoc-dien', icon: '🔎', children: [] },
  { label: 'NGƯỜI NGỌC ĐIỀN', href: '/nguoi-ngoc-dien', icon: '👥',
    children: [
      { label: 'Giới thiệu chung', href: '/nguoi-ngoc-dien' },
      { label: 'Mẹ Việt Nam Anh hùng', href: '/nguoi-ngoc-dien/me-vnah' },
      { label: 'Liệt sỹ', href: '/nguoi-ngoc-dien/liet-sy' },
      { label: 'Anh hùng lao động Cao Lục', href: '/nguoi-ngoc-dien/anh-hung' },
      { label: 'Đảng viên đầu tiên', href: '/nguoi-ngoc-dien/dang-vien' },
    ]},
  { label: 'LỊCH SỬ', href: '/lich-su', icon: '📜', children: [] },
  { label: 'TIẾNG LÀNG', href: '/tieng-lang', icon: '✍️',
    children: [
      { label: 'Tản văn', href: '/tieng-lang/tan-van' },
      { label: 'Thơ', href: '/tieng-lang/tho' },
      { label: 'Khám phá', href: '/tieng-lang/kham-pha' },
      { label: 'Góc nhìn thẳng', href: '/tieng-lang/goc-nhin-thang' },
      { label: 'Podcast', href: '/tieng-lang/podcast' },
    ]},
  { label: 'DI TÍCH', href: '/di-tich', icon: '🏛️',
    children: [{ label: 'Đền Ngọc Điền', href: '/di-tich/den' }, { label: 'Giếng làng', href: '/di-tich/gieng' }] },
  { label: 'LỄ HỘI', href: '/le-hoi', icon: '🎊',
    children: [
      { label: 'Lễ hội Đền', href: '/le-hoi/den' },
      { label: 'Lễ hội Xóm', href: '/le-hoi/xom' },
      { label: 'Lễ hội Giếng', href: '/le-hoi/gieng' },
    ]},
  { label: 'TƯ LIỆU', href: '/tu-lieu-ngoc-dien', icon: '📚',
    children: [{ label: 'Hương ước 1883', href: '/thu-vien/huong-uoc' }, { label: 'Ảnh cũ', href: '/tu-lieu-ngoc-dien?loai=anh-cu' }, { label: 'Gia phả', href: '/tu-lieu-ngoc-dien?loai=gia-pha' }] },
  { label: 'THƯ VIỆN', href: '/thu-vien', icon: '📚',
    children: [{ label: 'Hương ước 1883', href: '/thu-vien/huong-uoc' }, { label: 'Lịch sử Đảng bộ', href: '/thu-vien/dang-bo' }] },
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
      {/* ── TOP BAR ── */}
      <div className="bg-[#FFF8EE] border-b border-[#EAE0D0] py-1.5 hidden md:block">
        <div className="max-w-[1180px] mx-auto px-4 flex justify-between items-center">
          <p className="text-xs text-gray-500 font-sans">
            📅 {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="flex gap-5">
            <Link href="/gop-y" className="text-xs text-red font-sans font-semibold hover:underline">🔔 Gửi bài viết</Link>
          </div>
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <header className={`sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-xl' : 'shadow-md'}`}
        style={{ background: 'linear-gradient(180deg,#9B1B14 0%,#B91C1C 100%)' }}>
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="flex items-center justify-center relative py-3 md:py-4">
            {/* Logo */}
            <Link href="/" className="text-center group">
              <div className="font-display text-[clamp(22px,5vw,34px)] font-black text-white tracking-[3px] leading-none
                drop-shadow-md group-hover:text-yellow-100 transition-colors">
                NGỌC ĐIỀN
              </div>
              <div className="text-[#FBBF24] text-[10px] tracking-[5px] font-sans font-light mt-1">
                VĂN HÓA  ·  LỊCH SỬ  ·  CỘNG ĐỒNG
              </div>
              <div className="text-white/40 text-[9px] font-sans mt-0.5 tracking-wider">ngocdien.info.vn</div>
            </Link>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(true)}
              className="absolute right-0 flex flex-col gap-[5px] p-2.5 rounded-md
                border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Mở menu">
              {[0,1,2].map(i => (
                <span key={i} className="block w-5 h-0.5 bg-white rounded" />
              ))}
            </button>
          </div>
        </div>

        {/* Desktop nav strip */}
        <div className="hidden md:block bg-black/20 border-t border-white/10">
          <div className="max-w-[1180px] mx-auto px-4">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {NAV.map((item, i) => (
                <Link key={i} href={item.href}
                  className="text-white/90 hover:text-[#FBBF24] hover:bg-white/10 font-sans font-bold
                    text-[11px] tracking-[.6px] px-3 py-2.5 whitespace-nowrap transition-all">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── SLIDE-IN SIDE MENU ── */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/55 z-[900]" onClick={() => setMenuOpen(false)} />
      )}
      <nav className={`fixed top-0 right-0 h-full w-[360px] max-w-full bg-[#181818] z-[901]
        flex flex-col transition-transform duration-300 ease-in-out overflow-y-auto
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Menu header */}
        <div className="flex items-center justify-between px-5 py-4 bg-red shrink-0">
          <div>
            <div className="font-display text-xl font-black text-white">NGỌC ĐIỀN</div>
            <div className="text-white/60 text-[9px] tracking-[2px] font-sans mt-0.5">CỔNG THÔNG TIN ĐIỆN TỬ</div>
          </div>
          <button onClick={() => setMenuOpen(false)}
            className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20
              text-white flex items-center justify-center text-lg transition-colors">✕</button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-white/5 shrink-0">
          <input placeholder="🔍  Tìm tên người, sự kiện, di tích, hương ước..."
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-500
              rounded px-3 py-2 text-sm font-sans outline-none focus:border-[#C8942B] transition-colors" />
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto">
          {NAV.map((item, i) => (
            <div key={i}>
              <button onClick={() => { setExpanded(expanded === i ? null : i); if (!item.children.length) setMenuOpen(false); }}
                className="w-full flex justify-between items-center px-5 py-3
                  border-b border-white/5 text-gray-200 hover:bg-white/5
                  font-sans font-bold text-[12.5px] tracking-[.6px] transition-colors text-left">
                <span>{item.icon} &nbsp;{item.label}</span>
                {item.children.length > 0 && (
                  <span className={`text-gray-500 text-sm transition-transform duration-200 ${expanded === i ? 'rotate-90' : ''}`}>›</span>
                )}
              </button>
              {expanded === i && item.children.map((child: any, j) => (
                <Link key={j} href={child.href}
                  onClick={() => setMenuOpen(false)}
                  target={child.ext ? '_blank' : undefined}
                  className="block pl-12 pr-5 py-2.5 text-[#C8942B] text-[13px] font-sans
                    border-b border-white/[.04] bg-black/25 hover:bg-[#C8942B]/10 transition-colors">
                  ― {child.label}
                </Link>
              ))}
            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-black/40 shrink-0 text-xs font-sans space-y-1.5">
          <div className="text-gray-400">📧 tinnhanhonline247@gmail.com</div>
          <div className="text-gray-400">📞 0914 58 75 75</div>
          <div className="text-[#C8942B] font-bold mt-2">⚡ Phát triển bởi Thái Lão</div>
        </div>
      </nav>
    </>
  );
}
