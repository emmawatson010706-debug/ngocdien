import { getAllCategories } from '@/lib/supabase/queries';
import ArticleEditor from '@/components/admin/ArticleEditor';

export const metadata = { title: 'Tạo bài viết mới | Admin' };

export default async function NewArticlePage() {
  const categories = await getAllCategories();
  return <ArticleEditor categories={categories} />;
}
