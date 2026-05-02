import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import { ArticleCardGrid, ArticleCardHorizontal, SectionBlock } from '@/components/home/ArticleBlock';
import { getArticlesByCategory, getAllCategories } from '@/lib/supabase/queries';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cats = await getAllCategories();
  const cat  = cats.find(c => c.slug === params.slug);
  return { title: cat ? `${cat.name} | Ngọc Điền` : 'Chuyên mục' };
}

export const revalidate = 60;

export default async function CategoryPage({ params }: Props) {
  const cats     = await getAllCategories();
  const category = cats.find(c => c.slug === params.slug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(params.slug, 30);

  return (
    <PublicLayout>
      {/* Category banner */}
      <div className="bg-gradient-to-r from-[#9B1B14] to-[#B91C1C] text-white py-8">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center text-3xl">
              {category.icon ?? '📄'}
            </div>
            <div>
              <h1 className="font-display text-3xl font-black">{category.name}</h1>
              {category.description && (
                <p className="text-white/75 text-sm font-sans mt-1">{category.description}</p>
              )}
              <p className="text-white/50 text-xs font-sans mt-1">{articles.length} bài viết</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-4 py-7">
        {articles.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">{category.icon ?? '📄'}</div>
            <h2 className="font-display text-xl font-bold mb-2">Chưa có bài viết</h2>
            <p className="text-gray-500 font-sans text-sm">
              Chuyên mục này chưa có nội dung. Admin hãy đăng bài tại{' '}
              <a href="/admin" className="text-red underline">trang quản trị</a>.
            </p>
          </div>
        ) : (
          <>
            {/* Lead article */}
            {articles[0] && (
              <div className="mb-8">
                <SectionBlock icon={category.icon ?? '📄'} title={category.name}>
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                    {/* Featured */}
                    <a href={`/bai-viet/${articles[0].slug}`}
                      className="block rounded-xl overflow-hidden border border-[#E8DDD0] group cursor-pointer">
                      {articles[0].thumbnail_url && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img src={articles[0].thumbnail_url} alt={articles[0].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="p-5">
                        <h2 className="font-display text-xl font-bold leading-snug text-ink
                          group-hover:text-red transition-colors">
                          {articles[0].title}
                        </h2>
                        {articles[0].excerpt && (
                          <p className="text-sm text-gray-500 font-sans mt-2 leading-relaxed line-clamp-3">
                            {articles[0].excerpt}
                          </p>
                        )}
                      </div>
                    </a>
                    {/* Side list */}
                    <div>
                      {articles.slice(1, 5).map(a => (
                        <ArticleCardHorizontal key={a.id} article={a} />
                      ))}
                    </div>
                  </div>
                </SectionBlock>
              </div>
            )}

            {/* Rest as grid */}
            {articles.length > 5 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.slice(5).map(a => (
                  <ArticleCardGrid key={a.id} article={a} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}
