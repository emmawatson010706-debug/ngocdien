import type { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import { getAllPeople } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: 'Tra cứu người Ngọc Điền | Ngọc Điền',
  description: 'Tra cứu liệt sĩ, Mẹ Việt Nam Anh hùng, anh hùng lao động, đảng viên và nhân vật tiêu biểu của Xóm Ngọc Điền.',
};
export const revalidate = 300;

const TYPE_LABEL: Record<string, string> = {
  me_vnah: 'Mẹ Việt Nam Anh hùng',
  liet_sy: 'Liệt sĩ',
  anh_hung: 'Anh hùng lao động',
  dang_vien: 'Đảng viên',
  other: 'Nhân vật khác',
};

export default async function TraCuuNguoiPage({ searchParams }: { searchParams: { q?: string; loai?: string; nam?: string } }) {
  const q = (searchParams.q ?? '').toLowerCase().trim();
  const loai = searchParams.loai ?? '';
  const nam = searchParams.nam ?? '';
  const all = await getAllPeople();
  const people = all.filter(p => {
    const text = [p.full_name, p.hometown, p.biography, p.birth_year, p.death_year].filter(Boolean).join(' ').toLowerCase();
    const okQ = q ? text.includes(q) : true;
    const okLoai = loai ? p.type === loai : true;
    const okNam = nam ? String(p.birth_year ?? '').includes(nam) || String(p.death_year ?? '').includes(nam) : true;
    return okQ && okLoai && okNam;
  });

  return (
    <PublicLayout>
      <section className="bg-gradient-to-r from-[#9B1B14] to-[#1C1C1C] text-white">
        <div className="max-w-[1180px] mx-auto px-4 py-10 md:py-14">
          <p className="text-gold text-xs font-bold tracking-[3px] font-sans uppercase mb-3">Danh nhân · Liệt sĩ · Người làng</p>
          <h1 className="font-display text-3xl md:text-5xl font-black">Tra cứu người Ngọc Điền</h1>
          <p className="mt-4 max-w-2xl text-white/75 font-sans leading-relaxed">
            Tìm kiếm thông tin Mẹ Việt Nam Anh hùng, liệt sĩ, anh hùng lao động, đảng viên đầu tiên và những người con tiêu biểu của quê hương.
          </p>
        </div>
      </section>

      <main className="max-w-[1180px] mx-auto px-4 py-8">
        <form className="bg-white border border-[#E8DDD0] rounded-2xl p-4 md:p-5 shadow-sm mb-7 grid grid-cols-1 md:grid-cols-[1fr_220px_120px_120px] gap-3">
          <input name="q" defaultValue={searchParams.q ?? ''} placeholder="Nhập tên người, quê quán, ghi chú..."
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-red" />
          <select name="loai" defaultValue={loai} className="border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-red">
            <option value="">Tất cả loại nhân vật</option>
            {Object.entries(TYPE_LABEL).map(([value,label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <input name="nam" defaultValue={nam} placeholder="Năm"
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-red" />
          <button className="bg-red text-white rounded-xl font-bold font-sans text-sm px-4 py-3 hover:bg-red-dark">Tra cứu</button>
        </form>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-black">{people.length} kết quả</h2>
          <a href="/gop-y?type=gop_y" className="text-sm font-bold text-red hover:underline">Bổ sung / đính chính thông tin →</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {people.map(p => (
            <article key={p.id} className="bg-white border border-[#E8DDD0] rounded-2xl overflow-hidden shadow-sm">
              <div className="flex gap-4 p-4">
                <div className="w-20 h-24 rounded-xl bg-cream overflow-hidden shrink-0 flex items-center justify-center text-4xl">
                  {p.image_url ? <img src={p.image_url} alt={p.full_name} className="w-full h-full object-cover" /> : '👤'}
                </div>
                <div>
                  <p className="text-[11px] text-red font-bold uppercase tracking-wider font-sans">{TYPE_LABEL[p.type] ?? 'Người Ngọc Điền'}</p>
                  <h3 className="font-display text-xl font-black leading-tight mt-1">{p.full_name}</h3>
                  {(p.birth_year || p.death_year) && <p className="text-xs text-gray-500 font-sans mt-1">{p.birth_year ?? '?'} – {p.death_year ?? '?'}</p>}
                  {p.hometown && <p className="text-xs text-gray-500 font-sans">{p.hometown}</p>}
                </div>
              </div>
              {p.biography && <p className="px-4 pb-4 text-sm text-gray-600 font-sans leading-relaxed line-clamp-4">{p.biography}</p>}
            </article>
          ))}
        </div>

        {!people.length && (
          <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center bg-white">
            <div className="text-5xl mb-3">🔎</div>
            <p className="font-sans text-gray-500">Chưa tìm thấy dữ liệu phù hợp. Có thể Ban biên tập chưa cập nhật đủ hoặc cần bà con bổ sung thêm tư liệu.</p>
          </div>
        )}
      </main>
    </PublicLayout>
  );
}
