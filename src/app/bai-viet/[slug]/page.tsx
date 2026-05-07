import { supabase } from '@/lib/supabase/client';
import { Metadata } from 'next';
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1. TẠO THẺ META CHO ROBOT FACEBOOK & ZALO ĐỌC (QUAN TRỌNG NHẤT)
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
          url: data.img || 'https://ngocdien.info.vn/logo.png', // Ảnh đại diện bài viết
          width: 1200,
          height: 630,
          alt: data.title,
        }
      ],
      type: 'article',
    },
  };
}

// 2. GIAO DIỆN KHI BÀ CON BẤM TỪ ZALO/FB VÀO ĐỌC BÀI
export default async function ArticleSinglePage({ params }: { params: any }) {
  const slug = params?.slug;
  const { data: a } = await supabase.from('articles').select('*').eq('slug', slug).single();

  if (!a) {
    return (
      <div style={{ minHeight:"100vh", background:"#FEF9F2", color:"#1C1C1C" }}>
        <Header />
        <div style={{ textAlign:"center", padding:"100px 20px" }}>
          <h2>Không tìm thấy bài viết! Có thể đã bị xóa.</h2>
          <Link href="/" style={{ color:"#B91C1C", fontWeight:700, textDecoration:"underline" }}>← Về trang chủ</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Tự động tính thời gian đọc bài
  const textContent = a.content ? a.content.replace(/<[^>]*>?/gm, '') : (a.excerpt || '');
  const wordCount = textContent.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const url = `https://ngocdien.info.vn/bai-viet/${a.slug}`;

  return (
    <div style={{ minHeight:"100vh", background:"#FEF9F2", color:"#1C1C1C" }}>
      <Header />
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"20px 16px" }}>
        <div style={{ maxWidth:800, margin:"0 auto", background:"#fff", padding:"30px", borderRadius:"12px", boxShadow:"0 4px 15px rgba(0,0,0,0.05)" }}>
          
          <div style={{ display:"flex", gap:6, fontSize:12, color:"#aaa", marginBottom:14, flexWrap:"wrap" }}>
            <Link href="/" style={{ color:"#B91C1C", textDecoration:"none", fontWeight:700 }}>Trang chủ</Link>
            <span>›</span>
            <span style={{ color:"#555" }}>{a.title}</span>
          </div>
          
          <span style={{ background:"#B91C1C", color:"#fff", fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:4, textTransform:"uppercase" }}>
            {a.cat}
          </span>
          
          <h1 style={{ fontFamily:"'Lora', serif", fontSize:"clamp(20px,4vw,30px)", fontWeight:900, lineHeight:1.4, margin:"14px 0" }}>
            {a.title}
          </h1>
          
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #EAE0D0", paddingBottom:12, marginBottom:16, flexWrap:"wrap", gap:10 }}>
            <p style={{ color:"#aaa", fontSize:12.5, margin:0 }}>
              ✍️ {a.author || "Ban biên tập"}  ·  📅 {a.date}  ·  <span style={{color:"#0891B2", fontWeight:700}}>⏱️ Đọc {readTime} phút</span>
            </p>
          </div>
          
          <img src={a.img || '/logo.png'} alt={a.title} style={{ width:"100%", borderRadius:10, marginBottom:20, display:"block", maxHeight:500, objectFit:'cover' }}/>
          
          <div style={{ fontSize: "16px", lineHeight: 1.85, color: "#333", marginTop: 24 }} 
               dangerouslySetInnerHTML={{ __html: a.content || a.excerpt || "<p>Chưa có nội dung chi tiết.</p>" }} />
          
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:40, padding:"16px 0", borderTop:"1px solid #EDE5D8" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#888" }}>CHIA SẺ BÀI VIẾT NÀY:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" style={{ background:"#1877F2", color:"#fff", borderRadius:5, padding:"8px 16px", fontSize:12.5, fontWeight:700, textDecoration:"none" }}>📘 Facebook</a>
            <a href={`https://zalo.me/share/article?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" style={{ background:"#0057B8", color:"#fff", borderRadius:5, padding:"8px 16px", fontSize:12.5, fontWeight:700, textDecoration:"none" }}>💬 Zalo</a>
          </div>
          
          <div style={{ marginTop: 25 }}>
             <Link href="/" style={{ display:"inline-block", background:"#F3F4F6", color:"#374151", padding:"10px 20px", borderRadius:6, textDecoration:"none", fontWeight:700, fontSize:13, border:"1px solid #E5E7EB" }}>
               ← Về trang chủ
             </Link>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}