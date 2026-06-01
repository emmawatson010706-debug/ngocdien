import type { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import { getPeopleByType } from '@/lib/supabase/queries';
import type { Person } from '@/types/database';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Người Ngọc Điền | Ngọc Điền' };
export const revalidate = 300;

function PersonCard({ p, icon }: { p: Person; icon: string }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#E8DDD0] hover:shadow-md
      transition-shadow group">
      <div className="aspect-[4/5] overflow-hidden bg-gray-100">
        {p.image_url
          ? <img src={p.image_url} alt={p.full_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">{icon}</div>}
      </div>
      <div className="p-3">
        <p className="font-sans font-bold text-sm leading-snug text-ink">{p.full_name}</p>
        {(p.birth_year || p.death_year) && (
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            {p.birth_year ?? '?'} – {p.death_year ?? '?'}
          </p>
        )}
        {p.hometown && <p className="text-xs text-gray-400 font-sans">{p.hometown}</p>}
        {p.biography && (
          <p className="text-xs text-gray-500 font-sans mt-1.5 leading-relaxed line-clamp-2">{p.biography}</p>
        )}
      </div>
    </div>
  );
}

export default async function NguoiNgocDienPage() {
  const [meVnah, lietSy, anhHung, dangVien] = await Promise.all([
    getPeopleByType('me_vnah'),
    getPeopleByType('liet_sy'),
    getPeopleByType('anh_hung'),
    getPeopleByType('dang_vien'),
  ]);

  const sections = [
    { id:'me-vnah',   title:'Mẹ Việt Nam Anh hùng', icon:'🌺', people: meVnah,   color:'#B91C1C',
      desc:'4 bà mẹ anh hùng của Xóm Ngọc Điền đã cống hiến những người con yêu quý nhất vì độc lập Tổ quốc.' },
    { id:'liet-sy',   title:'Liệt sỹ Ngọc Điền',    icon:'🕯', people: lietSy,   color:'#1C1C1C',
      desc:`${lietSy.length || 42} người con anh dũng của Xóm Ngọc Điền đã ngã xuống trên các chiến trường vì độc lập dân tộc. Tên các anh sống mãi.` },
    { id:'anh-hung',  title:'Anh hùng Lao động',    icon:'🏅', people: anhHung,  color:'#065F46',
      desc:'Những cá nhân xuất sắc được Nhà nước phong tặng danh hiệu Anh hùng Lao động.' },
    { id:'dang-vien', title:'Đảng viên đầu tiên',   icon:'⭐', people: dangVien, color:'#1D4ED8',
      desc:'Những đảng viên tiên phong, đặt nền móng cho Chi bộ Đảng tại Xóm Ngọc Điền.' },
  ];

  return (
    <PublicLayout>
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#9B1B14] to-[#7C3AED] text-white py-10">
        <div className="max-w-[1180px] mx-auto px-4 text-center">
          <div className="text-5xl mb-3">👥</div>
          <h1 className="font-display text-4xl font-black">Người Ngọc Điền</h1>
          <p className="text-white/70 font-sans text-sm mt-2 max-w-xl mx-auto leading-relaxed">
            Tôn vinh những người con ưu tú của Xóm Ngọc Điền – những anh hùng, liệt sỹ, và tấm gương sáng trong lịch sử địa phương.
          </p>
          {/* Jump links */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`}
                className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs
                  font-sans font-bold px-4 py-1.5 rounded-full transition-colors">
                {s.icon} {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-4 py-10 space-y-14">
        {sections.map(sec => (
          <section key={sec.id} id={sec.id}>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-2 pb-3"
              style={{ borderBottom: `3px solid ${sec.color}` }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl text-white shrink-0"
                style={{ background: sec.color }}>{sec.icon}</div>
              <h2 className="font-display text-2xl font-black">{sec.title}</h2>
              <div className="flex-1 h-px bg-[#E8DDD0]" />
              <span className="text-sm font-bold font-sans text-gray-500">
                {sec.people.length > 0 ? `${sec.people.length} người` : ''}
              </span>
            </div>
            <p className="text-sm font-sans text-gray-500 leading-relaxed mb-6">{sec.desc}</p>

            {sec.people.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {sec.people.map(p => <PersonCard key={p.id} p={p} icon={sec.icon} />)}
              </div>
            ) : (
              <div className="py-10 text-center border border-dashed border-gray-200 rounded-xl">
                <div className="text-4xl mb-3">{sec.icon}</div>
                <p className="text-sm text-gray-400 font-sans">
                  Chưa có dữ liệu. Admin hãy thêm tại{' '}
                  <Link href="/admin/nguoi" className="text-red underline">trang quản trị</Link>.
                </p>
              </div>
            )}
          </section>
        ))}
      </div>
    </PublicLayout>
  );
}
