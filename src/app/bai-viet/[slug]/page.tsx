import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { ShareButtons } from '@/components/article/ShareButtons';
import { getArticleBySlug, getLatestArticles } from '@/lib/supabase/queries';
import { formatDate } from '@/lib/utils';
import { sanitizeRichHtml } from '@/lib/security';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Không tìm thấy bài viết' };
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.thumbnail_url ? [{ url: article.thumbnail_url }] : [],
      type: 'article',
      publishedTime: article.published_at ?? undefined,
    },
  };
}

export const revalidate = 120;

export default async function ArticlePage({ params }: Props) {
  const [article, related] = await Promise.all([
    getArticleBySlug(params.slug),
    getLatestArticles(5),
  ]);

  if (!article) notFound();

  const relatedFiltered = related.filter(a => a.id !== article.id).slice(0, 4);

  return (
    <PublicLayout>
      <div className="max-w-[1180px] mx-auto px-4 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* ── ARTICLE ── */}
          <article>
            {/* Breadcrumb */}
            <nav className="text-xs font-sans text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-red transition-colors">Trang chủ</Link>
              <span>›</span>
              {article.category_slug && (
                <>
                  <Link href={`/${article.category_slug}`} className="hover:text-red transition-colors">
                    {article.category_name}
                  </Link>
                  <span>›</span>
                </>
              )}
              <span className="text-ink line-clamp-1">{article.title}</span>
            </nav>

            {/* Category + date */}
            <div className="flex items-center gap-3 mb-3">
              {article.category_name && (
                <span className="tag bg-red">{article.category_name}</span>
              )}
              {article.published_at && (
                <span className="text-xs font-sans text-gray-400">
                  📅 {formatDate(article.published_at)}
                </span>
              )}
              <span className="text-xs font-sans text-gray-400">
                ✍️ {article.author_name}
              </span>
              {article.view_count > 0 && (
                <span className="text-xs font-sans text-gray-400">👁 {article.view_count} lượt xem</span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-[clamp(22px,4vw,32px)] font-black leading-tight mb-4 text-ink">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-base text-gray-600 font-sans leading-relaxed mb-5
                border-l-4 border-gold pl-4 bg-gold/10 py-3 pr-3 rounded-r-lg italic">
                {article.excerpt}
              </p>
            )}

            {/* Thumbnail */}
            {article.thumbnail_url && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <Image src={article.thumbnail_url} alt={article.title}
                  width={800} height={450} className="w-full object-cover" priority />
                <p className="text-xs text-gray-400 font-sans text-center mt-2 italic">
                  Ảnh: Ban biên tập Ngọc Điền
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 rounded-xl border border-[#E8DDD0] bg-cream/60 p-4 font-sans text-xs text-gray-600">
              <div><span className="font-bold text-ink">Nguồn tư liệu:</span> {article.source_note || 'Ban biên tập Ngọc Điền tổng hợp, đang tiếp tục đối chiếu và bổ sung.'}</div>
              <div><span className="font-bold text-ink">Người biên soạn:</span> {article.author_name || 'Ban biên tập'}</div>
              <div><span className="font-bold text-ink">Ngày công bố:</span> {article.published_at ? formatDate(article.published_at) : 'Đang cập nhật'}</div>
              <div><span className="font-bold text-ink">Cập nhật:</span> {article.updated_at ? formatDate(article.updated_at) : 'Đang cập nhật'}</div>
            </div>

            {/* Content */}
            <div className="article-body font-serif text-[15px] leading-[1.9]"
              dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(article.content) }} />

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="text-xs font-sans text-gray-400 font-bold">Tags:</span>
                {article.tags.map(tag => (
                  <span key={tag} className="bg-cream text-gray-600 text-xs font-sans
                    px-2.5 py-1 rounded-full border border-[#E8DDD0]">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 mb-6 rounded-xl border border-red/15 bg-red/5 p-4 font-sans">
              <h2 className="text-sm font-bold text-red mb-1">Đính chính / bổ sung tư liệu</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Nếu bà con có thêm ảnh cũ, tư liệu, tên nhân vật, mốc thời gian hoặc phát hiện chi tiết cần hiệu đính,
                xin gửi thông tin về Ban biên tập để cùng hoàn thiện kho tư liệu Ngọc Điền.
              </p>
              <Link href={`/gop-y?type=gop_y&subject=${encodeURIComponent('Góp ý bài viết: ' + article.title)}`}
                className="inline-block mt-3 text-sm font-bold text-red hover:underline">
                Gửi đính chính / bổ sung →
              </Link>
            </div>

            {/* Share */}
            <ShareButtons slug={article.slug} title={article.title} />

            {/* Author box */}
            <div className="bg-cream border border-[#E8DDD0] rounded-xl p-5 flex gap-4 items-start">
              <div className="w-14 h-14 rounded-full bg-red/10 border-2 border-red/20
                flex items-center justify-center text-2xl shrink-0">✍️</div>
              <div>
                <div className="font-sans font-bold text-sm text-ink">{article.author_name}</div>
                <div className="text-xs text-gray-500 font-sans mt-1">Ban biên tập – Cổng thông tin Xóm Ngọc Điền</div>
              </div>
            </div>
          </article>

          {/* ── SIDEBAR ── */}
          <aside>
            {/* Related */}
            <div className="bg-white border border-[#E8DDD0] rounded-xl p-4 mb-5">
              <h3 className="font-display font-bold text-base mb-3 pb-2 border-b border-[#EDE5D8]">
                📌 Bài viết liên quan
              </h3>
              <div className="space-y-0">
                {relatedFiltered.map(a => (
                  <Link key={a.id} href={`/bai-viet/${a.slug}`}
                    className="flex gap-2.5 py-3 border-b border-[#F5F0EA] last:border-0 group">
                    {a.thumbnail_url && (
                      <div className="w-16 h-12 rounded overflow-hidden shrink-0">
                        <img src={a.thumbnail_url} alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      </div>
                    )}
                    <p className="text-[12.5px] font-serif font-bold leading-snug text-ink
                      group-hover:text-red transition-colors line-clamp-2">
                      {a.title}
                    </p>
                  </Link>
                ))}
                {!relatedFiltered.length && (
                  <p className="text-xs text-gray-400 font-sans text-center py-4">Chưa có bài viết liên quan</p>
                )}
              </div>
            </div>

            {/* Back link */}
            <Link href="/" className="flex items-center gap-2 text-sm font-sans font-bold text-red hover:underline">
              ← Về trang chủ
            </Link>
          </aside>

        </div>
      </div>
    </PublicLayout>
  );
}
