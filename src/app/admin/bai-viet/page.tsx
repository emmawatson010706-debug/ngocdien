import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import ArticleActions from './ArticleActions';

export default async function AdminArticleList() {
  const sb = createServerSupabase();
  const { data: articles } = await sb
    .from('articles')
    .select('id, title, is_published, is_featured, category_id, published_at, view_count, thumbnail_url, categories(name)')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-black">Bài viết</h1>
          <p className="text-sm text-gray-500 font-sans mt-0.5">{articles?.length ?? 0} bài viết</p>
        </div>
        <Link href="/admin/bai-viet/moi" className="btn-primary">✏️ Tạo bài mới</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm font-sans">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Tiêu đề','Chuyên mục','Lượt xem','Ngày đăng','Trạng thái',''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles?.map(a => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 max-w-[280px]">
                  <div className="flex items-center gap-2">
                    {a.thumbnail_url && (
                      <img src={a.thumbnail_url} alt="" className="w-10 h-8 object-cover rounded shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-ink line-clamp-1">{a.title}</p>
                      {a.is_featured && <span className="text-[10px] text-gold font-bold">⭐ Nổi bật</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {(a.categories as any)?.name ?? '—'}
                </td>
                <td className="px-4 py-3 text-gray-500">{a.view_count}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {formatDate(a.published_at)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full
                    ${a.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.is_published ? '✅ Đã đăng' : '📋 Nháp'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/bai-viet/${a.id}`}
                      className="text-xs font-bold text-blue-600 hover:underline">Sửa</Link>
                    <ArticleActions id={a.id} isPublished={a.is_published} />
                  </div>
                </td>
              </tr>
            ))}
            {!articles?.length && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                Chưa có bài viết nào. <Link href="/admin/bai-viet/moi" className="text-red underline">Tạo bài đầu tiên →</Link>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
