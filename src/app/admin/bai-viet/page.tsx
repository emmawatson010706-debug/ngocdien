'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Vừa vào trang là tự động hút dữ liệu từ Supabase
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    // Hút TẤT CẢ bài viết, không lọc, xếp bài mới nhất lên trên
    const { data } = await supabase.from('articles').select('*').order('id', { ascending: false });
    setArticles(data || []);
    setLoading(false);
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Anh Thái Lão có chắc chắn muốn xóa bài viết này không?')) return;
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      alert('Lỗi xóa bài: ' + error.message);
    } else {
      alert('Đã xóa thành công!');
      fetchArticles(); // Xóa xong tự động load lại bảng
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-800">Quản lý Bài viết</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng: {articles.length} bài viết trong hệ thống</p>
        </div>
        <Link href="/admin/bai-viet/moi" 
          className="bg-[#B91C1C] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-red-800 transition-colors shadow-sm">
          + Viết bài mới
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium animate-pulse">⏳ Đang tải dữ liệu từ két sắt...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="px-5 py-4 font-bold w-24">Ảnh</th>
                  <th className="px-5 py-4 font-bold">Tiêu đề</th>
                  <th className="px-5 py-4 font-bold">Chuyên mục</th>
                  <th className="px-5 py-4 font-bold">Ngày đăng</th>
                  <th className="px-5 py-4 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500 italic">Chưa có bài viết nào.</td>
                  </tr>
                ) : articles.map((a) => (
                  <tr key={a.id} className="hover:bg-red-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-16 h-10 rounded overflow-hidden border border-gray-200 shadow-sm">
                        <img src={a.img || '/logo.png'} alt="thumbnail" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800">{a.title}</td>
                    <td className="px-5 py-3">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wide">
                        {a.cat}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 font-medium">{a.date}</td>
                    <td className="px-5 py-3 text-right space-x-4">
                      {/* Link dẫn vào trang Sửa */}
                      <Link href={`/admin/bai-viet/${a.id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-bold">
                        Sửa
                      </Link>
                      <button onClick={() => deleteArticle(a.id)} className="text-red-600 hover:text-red-800 hover:underline font-bold">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}