import type { Metadata } from 'next';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { searchPublishedArticles } from '@/lib/supabase/queries';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tư liệu Ngọc Điền | Ngọc Điền',
  description: 'Kho tư liệu về hương ước, ảnh cũ, văn bản, gia phả, ký ức và lịch sử Xóm Ngọc Điền.',
};
export const revalidate = 300;

const TOPICS = [
  { title: 'Hương ước', icon: '📜', href: '/thu-vien/huong-uoc', desc: 'Hương ước, lệ làng, quy ước và tư liệu cổ.' },
  { title: 'Ảnh cũ', icon: '🖼️', href: '/tu-lieu-ngoc-dien?loai=anh-cu', desc: 'Ảnh gia đình, đồng ruộng, đền, giếng, sinh hoạt xưa.' },
  { title: 'Văn bản', icon: '📄', href: '/tu-lieu-ngoc-dien?loai=van-ban', desc: 'Văn bản hành chính, trích lục, tài liệu địa phương.' },
  { title: 'Gia phả', icon: '🌳', href: '/tu-lieu-ngoc-dien?loai=gia-pha', desc: 'Tư liệu dòng họ, phả ký, phả đồ, nhân danh.' },
  { title: 'Ký ức', icon: '🪔', href: '/tu-lieu-ngoc-dien?loai=ky-uc', desc: 'Ký ức người làng, chuyện cũ, lời kể nhân chứng.' },
];

export default async function TuLieuNgocDienPage({ searchParams }: { searchParams: { q?: string; nam?: string; loai?: string } }) {
  const articles = await searchPublishedArticles({
    q: searchParams.q,
    categorySlug: 'thu-vien',
    year: searchParams.nam,
    limit: 80,
  });

  return (
    <PublicLayout>
      <section className="bg-[#111827] text-white border-b-4 border-gold">
        <div className="max-w-[1180px] mx-auto px-4 py-10 md:py-14">
          <p className="text-gold text-xs font-bold tracking-[3px] font-sans uppercase mb-3">Kho lưu trữ cộng đồng</p>
          <h1 className="font-display text-3xl md:text-5xl font-black leading-tight">Tư liệu Ngọc Điền</h1>
          <p className="mt-4 max-w-2xl text-white/75 font-sans leading-relaxed">
            Nơi tập hợp hương ước, ảnh cũ, văn bản, gia phả, ký ức và các nguồn tư liệu giúp bà con tra cứu, bổ sung và kiểm chứng thông tin về quê hương.
          </p>
        </div>
      </section>

      <main className="max-w-[1180px] mx-auto px-4 py-8">
        <form className="bg-white border border-[#E8DDD0] rounded-2xl p-4 md:p-5 shadow-sm mb-7 grid grid-cols-1 md:grid-cols-[1fr_130px_120px] gap-3">
          <input name="q" defaultValue={searchParams.q ?? ''}
            placeholder="Tìm hương ước, ảnh cũ, văn bản, gia phả, ký ức..."
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-red" />
          <input name="nam" defaultValue={searchParams.nam ?? ''} placeholder="Năm"
            className="border border-gray-200 rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-red" />
          <button className="bg-red text-white rounded-xl font-bold font-sans text-sm px-4 py-3 hover:bg-red-dark">Tìm kiếm</button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-9">
          {TOPICS.map(t => (
            <Link key={t.title} href={t.href} className="bg-white rounded-2xl border border-[#E8DDD0] p-5 hover:-translate-y-1 hover:shadow-md transition-all">
              <div className="text-4xl mb-3">{t.icon}</div>
              <h2 className="font-display font-black text-lg text-ink">{t.title}</h2>
              <p className="text-xs text-gray-500 font-sans leading-relaxed mt-2">{t.desc}</p>
            </Link>
          ))}
        </div>

        <div className="flex items-end justify-between border-b-2 border-[#1C1C1C] pb-3 mb-4">
          <div>
            <p className="text-xs text-red font-bold font-sans uppercase tracking-wider">Kết quả tư liệu</p>
            <h2 className="font-display text-2xl font-black">Bài viết & hồ sơ đã công bố</h2>
          </div>
          <Link href="/gop-y?type=gui_bai" className="hidden sm:inline-block text-sm font-bold text-red hover:underline">Gửi thêm tư liệu →</Link>
        </div>

        {articles.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {articles.map(a => (
              <Link key={a.id} href={`/bai-viet/${a.slug}`} className="bg-white border border-[#E8DDD0] rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex gap-4 p-4">
                <div className="w-24 h-20 rounded-xl bg-cream overflow-hidden shrink-0">
                  {a.thumbnail_url ? <img src={a.thumbnail_url} alt={a.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-base leading-snug line-clamp-2 text-ink">{a.title}</h3>
                  {a.excerpt && <p className="text-xs text-gray-500 font-sans mt-1.5 line-clamp-2">{a.excerpt}</p>}
                  <p className="text-[11px] text-gray-400 font-sans mt-2">{a.published_at ? formatDate(a.published_at) : 'Đang cập nhật'} · {a.author_name}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center bg-white">
            <div className="text-5xl mb-3">📚</div>
            <p className="font-sans text-gray-500">Chưa có tư liệu phù hợp. Bà con có thể gửi thêm thông tin để Ban biên tập kiểm chứng và cập nhật.</p>
            <Link href="/gop-y?type=gui_bai" className="inline-block mt-4 text-red font-bold hover:underline">Gửi tư liệu →</Link>
          </div>
        )}
      </main>
    </PublicLayout>
  );
}
