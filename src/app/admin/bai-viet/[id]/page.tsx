import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { getAllCategories } from '@/lib/supabase/queries';
import ArticleEditor from '@/components/admin/ArticleEditor';

export const metadata = { title: 'Sửa bài viết | Admin' };

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const sb = createServerSupabase();
  const [{ data: article }, categories] = await Promise.all([
    sb.from('articles').select('*').eq('id', params.id).single(),
    getAllCategories(),
  ]);

  if (!article) notFound();

  return <ArticleEditor article={article as any} categories={categories} />;
}
