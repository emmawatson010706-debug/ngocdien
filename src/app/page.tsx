import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import HeroCarousel from '@/components/home/HeroCarousel';
import { ArticleCardHorizontal, ArticleCardGrid, SectionBlock } from '@/components/home/ArticleBlock';
import { WeatherWidget, PodcastWidget, CommunityWidget, FeedbackWidget } from '@/components/sidebar/Widgets';
import { getFeaturedArticles, getLatestArticles, getArticlesByCategory,
         getPublishedPodcasts, getAllSettings } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: 'Xóm Ngọc Điền – Văn hóa · Lịch sử · Cộng đồng',
};

export const revalidate = 60; // ISR – cập nhật mỗi 60 giây

export default async function HomePage() {
  const [featured, latest, tinTuc, tiengLang, lichSu, ditich, lehoi, podcasts, settings] =
    await Promise.all([
      getFeaturedArticles(),
      getLatestArticles(6),
      getArticlesByCategory('tin-tuc', 5),
      getArticlesByCategory('tieng-lang', 4),
      getArticlesByCategory('lich-su', 3),
      getArticlesByCategory('di-tich', 3),
      getArticlesByCategory('le-hoi', 3),
      getPublishedPodcasts(5),
      getAllSettings(),
    ]);

  const heroSlides = featured.length ? featured : latest;

  return (
    <PublicLayout>
      {/* Hero */}
      <HeroCarousel articles={heroSlides} />

      {/* Newspaper quick access */}
      <section className="max-w-[1180px] mx-auto px-4 -mt-3 relative z-10">
        <div className="bg-white border border-[#E8DDD0] rounded-2xl shadow-lg p-4 md:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
            <div>
              <p className="text-red text-xs font-bold tracking-[2px] uppercase font-sans mb-1">Trung tâm tra cứu thông tin làng</p>
              <h2 className="font-display text-2xl font-black text-ink">Tìm nhanh tư liệu, nhân vật, di tích, hương ước và ký ức Ngọc Điền</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/tu-lieu-ngoc-dien" className="px-4 py-2 rounded-xl bg-[#1C1C1C] text-white text-sm font-bold font-sans hover:bg-red transition-colors">📚 Tư liệu</Link>
              <Link href="/tra-cuu-nguoi-ngoc-dien" className="px-4 py-2 rounded-xl bg-red text-white text-sm font-bold font-sans hover:bg-red-dark transition-colors">🔎 Tra cứu người</Link>
              <Link href="/gop-y?type=gui_bai" className="px-4 py-2 rounded-xl bg-gold text-[#1C1C1C] text-sm font-bold font-sans hover:opacity-90 transition-opacity">✉ Gửi tư liệu</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-[1180px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-7 pt-7">

          {/* ── LEFT CONTENT ── */}
          <div>

            {/* TIN TỨC */}
            <SectionBlock icon="📰" title="TIN TỨC" href="/tin-tuc">
              {tinTuc.length ? (
                <div>
                  {tinTuc.map(a => <ArticleCardHorizontal key={a.id} article={a} />)}
                </div>
              ) : (
                <EmptyState label="tin tức" />
              )}
            </SectionBlock>

            {/* NGƯỜI NGỌC ĐIỀN */}
            <SectionBlock icon="👥" title="NGƯỜI NGỌC ĐIỀN" color="#7C3AED" href="/nguoi-ngoc-dien">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mẹ VNAH card */}
                <Link href="/nguoi-ngoc-dien/me-vnah"
                  className="bg-gradient-to-br from-red/5 to-red/10 border border-red/20
                    rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-2">🌺</div>
                  <h3 className="font-display text-base font-bold mb-1">Mẹ Việt Nam Anh hùng</h3>
                  <p className="text-xs text-gray-500 font-sans leading-relaxed">
                    4 bà mẹ anh hùng – những người lặng thầm hy sinh vì Tổ quốc.
                  </p>
                  <span className="mt-3 inline-block text-xs font-sans font-bold text-red">Xem chi tiết →</span>
                </Link>

                {/* Liệt sỹ card */}
                <Link href="/nguoi-ngoc-dien/liet-sy"
                  className="bg-gradient-to-br from-[#1C1C1C] to-[#2d2d2d] rounded-xl p-5
                    hover:shadow-lg transition-shadow group">
                  <div className="text-5xl font-black text-gold leading-none mb-1"
                    style={{ fontFamily: "'Source Sans 3',sans-serif" }}>42</div>
                  <div className="text-gray-400 text-xs font-sans tracking-widest mb-2">LIỆT SỸ</div>
                  <h3 className="font-display text-base font-bold text-white mb-1">Danh sách Liệt sỹ</h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    42 người con anh dũng đã ngã xuống vì độc lập dân tộc.
                  </p>
                  <span className="mt-3 inline-block text-xs font-sans font-bold text-gold">Xem danh sách →</span>
                </Link>
              </div>
            </SectionBlock>

            {/* LỊCH SỬ */}
            <SectionBlock icon="📜" title="LỊCH SỬ XÓM NGỌC ĐIỀN" color="#92400E" href="/lich-su">
              {lichSu.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 rounded-lg overflow-hidden border border-[#F3DDB5]">
                  <div className="p-5 bg-gradient-to-br from-[#FEF7E8] to-[#FFFBF5]">
                    <h3 className="font-display text-lg font-bold leading-snug text-ink
                      border-l-4 border-[#B45309] pl-3 mb-3">
                      Ngọc Điền – Vùng đất địa linh nhân kiệt bên dòng sông Lam
                    </h3>
                    {lichSu.map(a => (
                      <Link key={a.id} href={`/bai-viet/${a.slug}`}
                        className="block text-sm font-sans text-gray-700 hover:text-red
                          py-1.5 border-b border-[#F3DDB5] transition-colors">
                        › {a.title}
                      </Link>
                    ))}
                    <Link href="/lich-su" className="btn-primary inline-block mt-4 text-xs">Đọc lịch sử đầy đủ →</Link>
                  </div>
                  <div className="min-h-[160px] hidden sm:block overflow-hidden">
                    <img src="https://picsum.photos/seed/lichsund/500/300"
                      alt="Lịch sử" className="w-full h-full object-cover" />
                  </div>
                </div>
              ) : (
                <EmptyState label="bài lịch sử" />
              )}
            </SectionBlock>

            {/* TIẾNG LÀNG */}
            <SectionBlock icon="✍️" title="TIẾNG LÀNG" color="#0891B2" href="/tieng-lang">
              {tiengLang.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tiengLang.map(a => <ArticleCardGrid key={a.id} article={a} />)}
                </div>
              ) : (
                <EmptyState label="bài viết Tiếng làng" />
              )}
            </SectionBlock>

            {/* DI TÍCH – LỄ HỘI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <SectionBlock icon="🏛️" title="DI TÍCH" color="#065F46" href="/di-tich">
                {ditich.length ? (
                  <div>{ditich.map(a => <ArticleCardHorizontal key={a.id} article={a} />)}</div>
                ) : <EmptyState label="bài di tích" />}
              </SectionBlock>

              <SectionBlock icon="🎊" title="LỄ HỘI" color="#DC2626" href="/le-hoi">
                {lehoi.length ? (
                  <div>{lehoi.map(a => <ArticleCardHorizontal key={a.id} article={a} />)}</div>
                ) : <EmptyState label="bài lễ hội" />}
              </SectionBlock>
            </div>

            {/* CHUYỂN ĐỔI SỐ */}
            <SectionBlock icon="💻" title="CHUYỂN ĐỔI SỐ" color="#1D4ED8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon:'🏛️', name:'Dịch vụ công', sub:'dichvucong.gov.vn', href:'https://dichvucong.gov.vn', ext:true, color:'#1D4ED8' },
                  { icon:'🪪', name:'VNeID', sub:'Căn cước số', href:'https://vneid.gov.vn', ext:true, color:'#065F46' },
                  { icon:'🌐', name:'Cổng tỉnh', sub:'nghean.gov.vn', href:'https://nghean.gov.vn', ext:true, color:'#7C3AED' },
                  { icon:'🗺️', name:'Bản đồ số', sub:'Ngọc Điền', href:'/chuyen-doi-so/ban-do', ext:false, color:'#B45309' },
                ].map(s => (
                  <a key={s.name} href={s.href} target={s.ext ? '_blank' : undefined} rel="noopener"
                    className="bg-white border rounded-xl p-4 text-center hover:-translate-y-1
                      hover:shadow-md transition-all duration-200"
                    style={{ borderColor: `${s.color}25`, borderTopWidth: 4, borderTopColor: s.color }}>
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <div className="text-xs font-bold font-sans" style={{ color: s.color }}>
                      {s.name}{s.ext && <span className="text-[9px]"> ↗</span>}
                    </div>
                    <div className="text-[11px] text-gray-400 font-sans mt-1">{s.sub}</div>
                  </a>
                ))}
              </div>
            </SectionBlock>

            {/* THƯ VIỆN */}
            <SectionBlock icon="📚" title="THƯ VIỆN" color="#7C3AED" href="/thu-vien">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title:'Hương ước 1883', desc:'Bản hương ước gốc hơn 140 năm – phản ánh luật tục và nếp sống của cha ông.', icon:'📜', color:'#92400E', bg:'#FEF3C7', href:'/thu-vien/huong-uoc' },
                  { title:'Lịch sử Đảng bộ', desc:'Tài liệu chính thức về quá trình hình thành Chi bộ Đảng tại Ngọc Điền.', icon:'🏛️', color:'#1D4ED8', bg:'#EFF6FF', href:'/thu-vien/dang-bo' },
                ].map(item => (
                  <Link key={item.title} href={item.href}
                    className="rounded-xl p-5 hover:shadow-md transition-shadow block"
                    style={{ background: item.bg, borderTop: `4px solid ${item.color}`,
                      border: `1px solid ${item.color}20`, borderTopWidth: 4 }}>
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="font-display text-base font-bold mb-2" style={{ color: item.color }}>{item.title}</h3>
                    <p className="text-xs text-gray-600 font-sans leading-relaxed">{item.desc}</p>
                    <span className="mt-3 inline-block text-xs font-bold font-sans" style={{ color: item.color }}>
                      Xem tài liệu →
                    </span>
                  </Link>
                ))}
              </div>
            </SectionBlock>

          </div>{/* end left */}

          {/* ── SIDEBAR ── */}
          <aside>
            <WeatherWidget />
            <PodcastWidget podcasts={podcasts} />
            <CommunityWidget
              zaloLink={settings.zalo_link}
              facebookLink={settings.facebook_link} />
            <FeedbackWidget />
          </aside>

        </div>
      </div>
    </PublicLayout>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-8 text-center text-sm text-gray-400 font-sans border border-dashed border-gray-200 rounded-lg">
      Chưa có {label}. Ban biên tập đang tiếp tục cập nhật nội dung.
    </div>
  );
}
