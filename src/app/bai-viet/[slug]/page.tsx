import { supabase } from '@/lib/supabase/client';
import { Metadata } from 'next';
import App from '@/app/page';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 🔥 PHẦN NÀY DÀNH RIÊNG CHO ROBOT FB/ZALO QUÉT DỮ LIỆU
export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const slug = params?.slug;
  const { data } = await supabase.from('articles').select('*').eq('slug', slug).single();
  
  if (!data) return { title: 'Xóm Ngọc Điền' };

  const shareTitle = data.title;
  const shareDesc = data.excerpt || "Mời bà con xem bài viết mới nhất trên Cổng thông tin điện tử Xóm Ngọc Điền.";
  const shareImg = data.img || 'https://ngocdien.info.vn/logo.png';

  return {
    title: shareTitle,
    description: shareDesc,
    openGraph: {
      title: shareTitle,
      description: shareDesc,
      url: `https://ngocdien.info.vn/bai-viet/${slug}`,
      siteName: 'Xóm Ngọc Điền',
      images: [{ url: shareImg, width: 1200, height: 630 }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: shareDesc,
      images: [shareImg],
    },
  };
}

// HIỂN THỊ GIAO DIỆN CHUẨN (MƯỢN TỪ TRANG CHỦ)
export default function Page() {
  return <App />;
}