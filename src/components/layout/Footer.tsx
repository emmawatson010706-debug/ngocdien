import Link from 'next/link';

const COLS = [
  { title: 'Chuyên mục', links: [
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Tin tức', href: '/tin-tuc' },
    { label: 'Lịch sử Xóm', href: '/lich-su' },
    { label: 'Tiếng làng', href: '/tieng-lang' },
    { label: 'Di tích', href: '/di-tich' },
  ]},
  { title: 'Người Ngọc Điền', links: [
    { label: 'Mẹ VNAH', href: '/nguoi-ngoc-dien/me-vnah' },
    { label: 'Liệt sỹ', href: '/nguoi-ngoc-dien/liet-sy' },
    { label: 'Anh hùng lao động', href: '/nguoi-ngoc-dien/anh-hung' },
    { label: 'Thư viện', href: '/thu-vien' },
    { label: 'Lễ hội', href: '/le-hoi' },
  ]},
  { title: 'Tiện ích', links: [
    { label: 'Góp ý & Gửi bài', href: '/gop-y' },
    { label: 'Chuyển đổi số', href: '/chuyen-doi-so' },
    { label: 'Cộng đồng Zalo', href: '#' },
    { label: 'Cộng đồng Facebook', href: '#' },
    { label: 'Quản trị', href: '/admin' },
  ]},
];

export default function Footer() {
  return (
    <footer className="bg-[#181818] text-white mt-12">
      <div className="h-1 bg-red" />
      <div className="h-0.5 bg-gold" />

      <div className="max-w-[1180px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          {/* Brand */}
          <div>
            <Link href="/">
              <div className="font-display text-3xl font-black tracking-[3px]">NGỌC ĐIỀN</div>
              <div className="text-gold text-[10px] tracking-[4px] font-sans mt-1.5">
                VĂN HÓA · LỊCH SỬ · CỘNG ĐỒNG
              </div>
            </Link>
            <p className="text-gray-400 text-[13px] font-sans leading-relaxed mt-4 max-w-[260px]">
              Cổng thông tin điện tử Xóm Ngọc Điền – nơi lưu giữ, phát huy và lan tỏa văn hóa,
              lịch sử, kết nối cộng đồng địa phương.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-gray-300 text-[13px] font-sans">📧 tinnhanhonline247@gmail.com</p>
              <p className="text-gray-300 text-[13px] font-sans">📞 0914 58 75 75</p>
            </div>
            <div className="flex gap-2.5 mt-5">
              {[['💬','#0057B8'],['📘','#1877F2']].map(([icon, color], i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg
                    hover:opacity-80 transition-opacity"
                  style={{ background: color }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {COLS.map((col, ci) => (
            <div key={ci}>
              <h4 className="text-gold text-[11px] font-bold font-sans tracking-[1.5px] uppercase mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link, li) => (
                  <li key={li}>
                    <Link href={link.href}
                      className="text-gray-400 text-[13px] font-sans hover:text-gold transition-colors">
                      › {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-4 flex flex-wrap gap-3 justify-between items-center">
          <p className="text-gray-500 text-xs font-sans">
            © {new Date().getFullYear()} Xóm Ngọc Điền, Hưng Nguyên, Nghệ An. Bảo lưu mọi quyền.
          </p>
          <p className="text-gold text-xs font-sans font-bold">⚡ Phát triển bởi Thái Lão</p>
        </div>
      </div>
    </footer>
  );
}