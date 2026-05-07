import { supabase } from '@/lib/supabase/client';
import { Metadata } from 'next';

// 🚀 THỦ THUẬT CHUYÊN GIA: Bỏ force-dynamic, dùng ISR (Cache 60 giây)
// Giúp Vercel trả kết quả ngay lập tức cho Facebook mà không kích hoạt tường lửa chặn Bot (Lỗi 403)
export const revalidate = 60;

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const slug = params?.slug;
  
  try {
    const { data } = await supabase.from('articles').select('*').eq('slug', slug).single();

    if (!data) return { title: 'Xóm Ngọc Điền - Cổng thông tin' };

    const title = data.title;
    const desc = data.excerpt || "Mời bà con đọc chi tiết bài viết trên Cổng thông tin Xóm Ngọc Điền.";
    const url = `https://ngocdien.info.vn/bai-viet/${data.slug}`;
    const img = data.img || 'https://ngocdien.info.vn/logo.png';

    // Trả về bộ thẻ Open Graph chuẩn mực nhất cho Facebook/Zalo
    return {
      title: title,
      description: desc,
      openGraph: {
        title: title,
        description: desc,
        url: url,
        siteName: 'Xóm Ngọc Điền',
        images: [{ url: img, width: 1200, height: 630 }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: desc,
        images: [img],
      }
    };
  } catch (error) {
    return { title: 'Xóm Ngọc Điền' };
  }
}

// NGƯỜI THẬT BẤM VÀO SẼ ĐƯỢC CHUYỂN HƯỚNG VỀ TRANG CHỦ ĐỂ ĐỌC MƯỢT MÀ
export default function ArticleSinglePage({ params }: { params: any }) {
  const slug = params?.slug;
  return (
    <div style={{ minHeight: "100vh", background: "#FEF9F2", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <p style={{ color: "#B91C1C", fontWeight: 700, fontFamily: "sans-serif" }}>Đang tải bài viết...</p>
      <script dangerouslySetInnerHTML={{ __html: `window.location.replace('/?xem-bai=${slug}');` }} />
    </div>
  );
}