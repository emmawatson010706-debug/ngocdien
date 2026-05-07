import { supabase } from '@/lib/supabase/client';
import { Metadata } from 'next';
import App from '@/app/page'; // Kéo nguyên giao diện chuẩn của Trang chủ vào đây

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// TẠO THẺ THÔNG TIN CHO FACEBOOK / ZALO ĐỌC
export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const slug = params?.slug;
  const { data } = await supabase.from('articles').select('*').eq('slug', slug).single();
  
  if (!data) return { title: 'Không tìm thấy bài viết - Xóm Ngọc Điền' };

  return {
    title: data.title,
    description: data.excerpt || "Mời bà con đọc chi tiết bài viết trên Cổng thông tin Xóm Ngọc Điền.",
    openGraph: {
      title: data.title,
      description: data.excerpt || "Mời bà con đọc chi tiết bài viết trên Cổng thông tin Xóm Ngọc Điền.",
      url: `https://ngocdien.info.vn/bai-viet/${data.slug}`,
      siteName: 'Xóm Ngọc Điền',
      images: [
        {
          url: data.img || 'https://ngocdien.info.vn/logo.png',
          width: 1200,
          height: 630,
          alt: data.title,
        }
      ],
      type: 'article',
    },
  };
}

// HIỂN THỊ GIAO DIỆN Y HỆT TRANG CHỦ
export default function ArticleSinglePage() {
  return <App />;
}