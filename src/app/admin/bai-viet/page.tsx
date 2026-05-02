import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import ArticleActions from './ArticleActions';

export default async function AdminArticleList() {
  const sb = createServerSupabase();
  
  // Nắn lại ống hút: Lấy tất cả (*) thay vì đòi các cột không có
  const { data: articles, error } = await sb
    .from('articles')
    .select('*')
    .order('id', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Lỗi lấy bài viết:', error.message);
  }

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
              {['Tiêu đề','Chuyên mục','Ngày đăng','Trạng thái',''].map(h => (
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
                    {/* Dùng đúng tên cột ảnh của két sắt là 'img' */}
                    {a.img && (
                      <img src={a.img} alt="" className="w-10 h-8 object-cover rounded shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-ink line-clamp-1">{a.title}</p>
                    </div>
                  </div>
                </td>
                
                {/* Dùng đúng tên cột chuyên mục là 'cat' */}
                <td className="px-4 py-3 text-gray-500">
                  {a.cat === 'tin-tuc' ? 'Tin tức' : a.cat === 'lich-su' ? 'Lịch sử' : a.cat === 'tieng-lang' ? 'Tiếng làng' : a.cat}
                </td>
                
                {/* Dùng đúng tên cột ngày là 'date' */}
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {a.date || 'Chưa rõ'}
                </td>
                
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                    ✅ Đã đăng
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/bai-viet/${a.id}`}
                      className="text-xs font-bold text-blue-600 hover:underline">Sửa</Link>
                    <ArticleActions id={a.id} isPublished={true} />
                  </div>
                </td>
              </tr>
            ))}
            {!articles?.length && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                Chưa có bài viết nào. <Link href="/admin/bai-viet/moi" className="text-red underline">Tạo bài đầu tiên →</Link>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}