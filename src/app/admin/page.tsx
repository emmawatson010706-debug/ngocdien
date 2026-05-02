import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';

async function getStats() {
  const sb = createServerSupabase();
  
  // Dùng count để đếm số lượng dòng trong từng bảng
  const [arts, people, pods, subs] = await Promise.all([
    sb.from('articles').select('id', { count: 'exact' }),
    sb.from('people').select('id', { count: 'exact' }),
    sb.from('podcasts').select('id', { count: 'exact' }),
    sb.from('submissions').select('id', { count: 'exact' }),
  ]);
  
  return {
    articles: arts.count ?? 0,
    people:   people.count ?? 0,
    podcasts: pods.count ?? 0,
    pending:  subs.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { icon:'📝', label:'Bài viết', value: stats.articles, sub:`${stats.articles} tổng`, href:'/admin/bai-viet', color:'#B91C1C' },
    { icon:'👥', label:'Người ND',  value: stats.people,   sub:'hồ sơ',           href:'/admin/nguoi',   color:'#7C3AED' },
    { icon:'🎙', label:'Podcast',   value: stats.podcasts, sub:'tập',             href:'/admin/podcast', color:'#0891B2' },
    { icon:'✉️', label:'Góp ý chờ', value: stats.pending,  sub:'cần xử lý',       href:'/admin/gop-y',   color:'#D97706' },
  ];

  const quickLinks = [
    { label:'✏️ Đăng bài mới',      href:'/admin/bai-viet/moi' },
    { label:'👤 Thêm Liệt sỹ / Mẹ VNAH', href:'/admin/nguoi' },
    { label:'🎙 Thêm Podcast',      href:'/admin/podcast' },
    { label:'⚙️ Cài đặt website',   href:'/admin/cai-dat' },
    { label:'🌐 Xem trang chủ',     href:'/' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-black mb-1">Tổng quan</h1>
      <p className="text-sm text-gray-500 font-sans mb-7">Chào mừng quay lại, Admin!</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <Link key={c.href} href={c.href}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100
              hover:shadow-md transition-shadow group"
            style={{ borderTop: `4px solid ${c.color}` }}>
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className="text-3xl font-black" style={{ color: c.color,
              fontFamily: "'Source Sans 3',sans-serif" }}>{c.value}</div>
            <div className="text-xs text-gray-400 font-sans mt-1">{c.sub}</div>
            <div className="text-sm font-bold font-sans text-gray-700 mt-1
              group-hover:underline">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-display font-bold text-lg mb-4">⚡ Thao tác nhanh</h2>
          <div className="space-y-2">
            {quickLinks.map(l => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50
                  hover:bg-red/5 hover:text-red border border-transparent hover:border-red/20
                  text-sm font-sans font-semibold transition-all">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-display font-bold text-lg mb-4">📋 Hướng dẫn quản trị</h2>
          <ul className="space-y-3 text-sm font-sans text-gray-600">
            {[
              '📝 Đăng bài: Bài viết → Tạo mới → điền nội dung → Đăng ngay',
              '⭐ Bài nổi bật: tick "Nổi bật" để hiện carousel trang chủ (tối đa 5)',
              '👥 Liệt sỹ / Mẹ VNAH: Người Ngọc Điền → Thêm hồ sơ → chọn loại',
              '🎙 Podcast: Upload file MP3 → điền tên tập → Xuất bản',
              '✉️ Góp ý: vào Góp ý để xem & phản hồi người dân',
              '⚙️ Cài đặt: thay logo, link Zalo/Facebook, email liên hệ',
            ].map((tip, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="shrink-0">›</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}