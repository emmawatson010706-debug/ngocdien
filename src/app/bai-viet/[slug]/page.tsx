import { supabase } from '@/lib/supabase/client';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1. TẠO THẺ META CHO ROBOT FACEBOOK & ZALO ĐỌC 
export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const slug = params?.slug;
  const { data } = await supabase.from('articles').select('*').eq('slug', slug).single();

  if (!data) return { title: 'Xóm Ngọc Điền' };

  return {
    title: data.title,
    description: data.excerpt || "Mời bà con đọc chi tiết bài viết trên Cổng thông tin Xóm Ngọc Điền.",
    openGraph: {
      title: data.title,
      description: data.excerpt || "Mời bà con đọc chi tiết bài viết trên Cổng thông tin Xóm Ngọc Điền.",
      url: `https://ngocdien.info.vn/bai-viet/${data.slug}`,
      siteName: 'Xóm Ngọc Điền',
      images: [{ url: data.img || 'https://ngocdien.info.vn/logo.png', width: 1200, height: 630 }],
      type: 'article',
    },
  };
}

// 2. NGƯỜI THẬT BẤM VÀO SẼ ĐƯỢC MỜI VỀ TRANG CHỦ ĐỂ ĐỌC BÀI
export default function ArticleSinglePage({ params }: { params: any }) {
  const slug = params?.slug;
  return (
    <div style={{ minHeight: "100vh", background: "#FEF9F2", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <p style={{ color: "#B91C1C", fontWeight: 700, fontFamily: "sans-serif" }}>Đang tải bài viết...</p>
      {/* Lệnh điều hướng khách về trang chủ và báo cho trang chủ biết cần mở bài nào */}
      <script dangerouslySetInnerHTML={{ __html: `window.location.replace('/?xem-bai=${slug}');` }} />
    </div>
  );
}