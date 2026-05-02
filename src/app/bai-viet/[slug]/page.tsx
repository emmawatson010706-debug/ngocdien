import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import { ARTS, CATS } from "../../../data/mockData";
import ShareButton from "../../../components/ShareButton";

// --- BỘ MÁY TẠO THẺ META TỰ ĐỘNG ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = ARTS.find(a => a.slug === params.slug);

  if (!article) return { title: 'Không tìm thấy bài viết | Xóm Ngọc Điền' };

  const url = `https://www.ngocdien.info.vn/bai-viet/${article.slug}`;
  const rawImageUrl = article.img.replace("400/220", "800/440");
  
  // CHIÊU BÀI ÉP TÊN MIỀN VÀO ẢNH CHO FACEBOOK
  const absoluteImageUrl = rawImageUrl.startsWith("http") ? rawImageUrl : `https://www.ngocdien.info.vn${rawImageUrl}`;

  return {
    title: `${article.title} | Xóm Ngọc Điền`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: url,
      siteName: 'Cổng thông tin Xóm Ngọc Điền',
      images: [
        {
          url: absoluteImageUrl, // Gắn ảnh đã có tên miền
          width: 800,
          height: 440,
          alt: article.title,
        },
      ],
      locale: 'vi_VN',
      type: 'article',
    },
  };
}
// ------------------------------------------------------

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTS.find(a => a.slug === params.slug);
  if (!article) return notFound();

  const catLabel = CATS.find(c => c.slug === article.cat)?.label || article.cat;

  return (
    <div style={{ minHeight:"100vh", background:"#FEF9F2", fontFamily:"system-ui,-apple-system,sans-serif", color:"#1C1C1C" }}>
      <Header />
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 16px" }}>
        <div style={{ maxWidth:800, margin:"0 auto", padding:"22px 0" }}>
          
          <div style={{ display:"flex", gap:6, fontSize:12, color:"#aaa", marginBottom:14, flexWrap:"wrap" }}>
            <Link href="/" style={{ textDecoration:"none", color:"#B91C1C", fontSize:12 }}>Trang chủ</Link>
            <span>›</span>
            <Link href={`/chuyen-muc/${article.cat}`} style={{ textDecoration:"none", color:"#B91C1C", fontSize:12 }}>{catLabel}</Link>
            <span>›</span>
            <span style={{ color:"#555" }}>{article.title}</span>
          </div>

          <span style={{ background:"#B91C1C", color:"#fff", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:2, textTransform:"uppercase", display:"inline-block" }}>{catLabel}</span>
          
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(20px,4vw,30px)", fontWeight:900, lineHeight:1.38, margin:"12px 0" }}>{article.title}</h1>
          <p style={{ color:"#aaa", fontSize:12.5, marginBottom:16 }}>✍️ Ban biên tập &nbsp;·&nbsp; 📅 {article.date}</p>

          <img src={article.img.replace("400/220","800/440")} alt={article.title} style={{ width:"100%", borderRadius:10, marginBottom:20, display:"block" }}/>
          
          <p style={{ fontStyle:"italic", color:"#555", fontSize:14, lineHeight:1.85, borderLeft:"4px solid #C8942B", paddingLeft:14, background:"#FEF9EC", padding:"12px 14px", borderRadius:"0 8px 8px 0", marginBottom:20 }}>
            {article.excerpt}
          </p>

          <div style={{ fontSize:15, lineHeight:1.9, color:"#333" }}>
            <p>Đây là nội dung đầy đủ của bài viết. Khi kết nối Supabase, nội dung bài sẽ được lấy từ cơ sở dữ liệu và hiển thị tại đây với đầy đủ định dạng: tiêu đề, hình ảnh, video và đoạn văn.</p>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:24, padding:"14px 0", borderTop:"1px solid #EDE5D8", borderBottom:"1px solid #EDE5D8" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#888" }}>CHIA SẺ:</span>
            
            {/* GỌI NÚT CHIA SẺ MỚI */}
            <ShareButton title={article.title} excerpt={article.excerpt} />

          </div>

          <Link href="/" style={{ display:"inline-block", marginTop:20, background:"#B91C1C", color:"#fff", border:"none", borderRadius:5, padding:"8px 18px", fontWeight:700, textDecoration:"none", fontSize:13 }}>← Về trang chủ</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}