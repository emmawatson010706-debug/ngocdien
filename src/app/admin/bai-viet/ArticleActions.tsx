'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function ArticleActions({ id, isPublished }: { id: string; isPublished: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const togglePublish = async () => {
    setLoading(true);
    await supabase.from('articles').update({
      is_published: !isPublished,
      published_at: !isPublished ? new Date().toISOString() : null,
    }).eq('id', id);
    setLoading(false);
    router.refresh();
  };

  const deleteArticle = async () => {
    if (!confirm('Xóa bài viết này? Không thể hoàn tác!')) return;
    setLoading(true);
    await supabase.from('articles').delete().eq('id', id);
    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <button onClick={togglePublish} disabled={loading}
        className={`text-xs font-bold hover:underline disabled:opacity-50
          ${isPublished ? 'text-orange-500' : 'text-green-600'}`}>
        {isPublished ? 'Ẩn' : 'Đăng'}
      </button>
      <button onClick={deleteArticle} disabled={loading}
        className="text-xs font-bold text-red hover:underline disabled:opacity-50">
        Xóa
      </button>
    </>
  );
}
